import { useRouter } from "next/router";
import { Layout, Typography, Row, Col } from "antd";
import Members from "../../components/Members";
import { useEffect, useState } from "react";
import { supabase } from "/utils/supabaseClient";
import JoinedRooms from "../../components/JoinedRooms";
import Messages from "../../components/Messages";
import MessageInput from "../../components/MessageInput";
import PageHeader from "../../components/PageHeader";

const { Text } = Typography;
const { Header, Sider, Content, Footer } = Layout;

export default function Room() {
	const [room, setRoom] = useState({});

	const router = useRouter();
	const user = supabase.auth.user();

	const fetchDetails = async () => {
		console.log("Fetching new room details");
		const { data, error } = await supabase
			.from("rooms")
			.select("*")
			.eq("id", router.query.id)
			.single();
		if (!data || error) {
			alert("Unable to retrieve room details");
			return;
		}
		setRoom(data);
	};

	const updateOnlineStatus = async () => {
		console.log("updated now");
		const { error } = await supabase
			.from("profiles")
			.update({ last_online: new Date() })
			.eq("id", user.id);
		if (error) alert(error.message);
	};

	useEffect(() => {
		updateOnlineStatus();
		const timer = setInterval(() => {
			updateOnlineStatus();
		}, 1000 * 60);
		return () => {
			clearInterval(timer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (router.isReady) fetchDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	if (!router.isReady) return <div></div>;

	return (
		<Layout
			style={{
				height: "100vh",
			}}
		>
			<PageHeader />
			<Content style={{ height: "100%" }}>
				<Layout style={{ height: "100%" }}>
					<Sider
						theme="light"
						breakpoint="md"
						collapsedWidth={0}
						style={{
							height: "100%",
							overflow: "auto",
						}}
					>
						<JoinedRooms />
					</Sider>
					<Content style={{ height: "100%" }}>
						<Layout style={{ height: "100%" }}>
							<Header
								style={{
									borderStyle: "solid",
									borderWidth: "1px 0",
									borderColor: "#f0f0f0",
									backgroundColor: "white",
								}}
							>
								<Row align="middle" justify="space-between">
									<Col justify="center">
										<Text level={4}>{room.name}</Text>
									</Col>
									<Col></Col>
								</Row>
							</Header>
							<Content>
								<Messages />
							</Content>
							<Footer style={{ backgroundColor: "white" }}>
								<MessageInput roomId={room.id} />
							</Footer>
						</Layout>
					</Content>
					<Sider
						theme="light"
						style={{
							padding: "1rem",
							overflow: "auto",
							height: "100%",
							borderLeft: "1px solid #f0f0f0",
						}}
					>
						<Typography.Title level={3}>Members</Typography.Title>
						<Members />
					</Sider>
				</Layout>
			</Content>
		</Layout>
	);
}
