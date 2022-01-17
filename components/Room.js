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
import Messages from "./Messages";
import MessageInput from "./MessageInput";
const { TextArea } = Input;
const { Title, Text } = Typography;
export default function Room({ room }) {
	// const [form] = Form.useForm();
	const user = supabase.auth.user();

	useEffect(() => {
		joinElement();
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [room]);

	const joinRoom = async () => {
		const { data, error } = await supabase
			.from("room_participants")
			.insert({ user_id: user.id, room_id: room.id });
		if (error) alert(error.message);
	};

	const [joinButton, setJoinButton] = useState(<div></div>);

	const joinElement = async () => {
		if (room.created_by != user.id) {
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
		} else {
			setJoinButton(<></>);
		}
	};

	return (
		<Layout>
			<Layout>
				<Header
					style={{
						borderStyle: "solid ",
						borderColor: "lightgray",
						borderWidth: "2px 0",
						backgroundColor: "white",
					}}
				>
					<Row align="middle" justify="space-between">
						<Col justify="center">
							<Text level={4}>Room {room.name}</Text>
						</Col>
						<Col>{joinButton}</Col>
					</Row>
				</Header>
				<Messages pickedRoom={room} />
				{/* <Content>Content</Content> */}
				<Footer
					style={{
						width: "100%",
						backgroundColor: "white",
					}}
				>
					<MessageInput room={room} />
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
				<Typography.Title level={3}>Members</Typography.Title>
				<Members roomId={room.id} />
			</Sider>
		</Layout>
	);
}
