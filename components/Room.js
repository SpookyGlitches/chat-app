import RoomHeader from "./RoomHeader";
import {
	Layout,
	Empty,
	Typography,
	Space,
	Row,
	Input,
	Col,
	Button,
	Form,
} from "antd";
import Members from "./Members";
const { Header, Sider, Content, Footer } = Layout;
import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const { TextArea } = Input;
const { Title, Text } = Typography;
export default function Room({ room }) {
	const [form] = Form.useForm();
	// console.log("data", room);

	useEffect(() => {
		joinElement();
		return () => {
			form.resetFields();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [room]);

	const handleTextAreaChange = (e) => {
		if (e.keyCode === 13 && !e.shiftKey) {
			console.log("submit");
		}
	};
	const user = supabase.auth.user();

	const joinRoom = async () => {
		const { data, error } = await supabase
			.from("room_participants")
			.insert({ user_id: user.id, room_id: room.id });
		if (error) alert(error.message);
	};

	const [joinButton, setJoinButton] = useState(<div></div>);
	const joinElement = async () => {
		const { data, error } = await supabase
			.from("room_participants_view")
			.select()
			.match({ rp_room_id: room.id, user_id: user.id });
		console.log(data);
		if (error || !data || data.length != 0)
			setJoinButton(<div></div>);
		if (data.length == 0)
			setJoinButton(
				<Button
					type="primary"
					size="large"
					icon={<PlusCircleOutlined />}
					onClick={joinRoom}
				>
					Join
				</Button>
			);
		return <div></div>;
	};

	return (
		<Layout>
			<Layout>
				<Header
					style={{
						backgroundColor: "white",
					}}
				>
					<Row
						align="middle"
						justify="space-between"
						style={{}}
					>
						<Col justify="center">
							<Text level={4}>
								Room {room.name}
							</Text>
						</Col>
						<Col>{joinButton}</Col>
					</Row>
				</Header>
				<Content>Content</Content>
				<Footer
					style={{
						width: "100%",
						backgroundColor: "white",
					}}
				>
					<Form
						form={form}
						layout="inline"
						style={{
							width: "100%",
							backgroundColor: "red",
						}}
						onFinish={() => {}}
					>
						<Form.Item
							name="roomName"
							style={{
								width: "100%",
							}}
						>
							<TextArea
								rows={2}
								onKeyDown={
									handleTextAreaChange
								}
							/>
						</Form.Item>
					</Form>
				</Footer>
			</Layout>
			<Sider
				theme="light"
				style={{
					padding: "1rem",
					overflow: "auto",
					height: "100%",
				}}
			>
				<Typography.Title level={3}>
					Members
				</Typography.Title>
				<Members roomId={room.id} />
			</Sider>
		</Layout>
	);
}
