import {
	List,
	Layout,
	Modal,
	Row,
	Col,
	Typography,
	Space,
	Skeleton,
	Form,
	Input,
	Button,
	Avatar,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { formatRelative } from "date-fns";
import PageHeader from "../../components/PageHeader";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function Index() {
	const [rooms, setRooms] = useState([]);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [clickedRoom, setClickedRoom] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const [form] = Form.useForm();
	const router = useRouter();
	const user = supabase.auth.user();

	const pageSize = 4;

	const createRoom = async (values) => {
		if (!values.roomName || values.roomName.length == 0) return;
		const { data: insertRoomData, error: insertRoomError } = await supabase
			.from("rooms")
			.insert({
				created_by: user.id,
				name: values.roomName,
			});

		if (insertRoomError) {
			alert("Unable to create room. Try again.");
			console.log(insertRoomError);
			return;
		}
		// i think supabase doesn't have any transactions
		const { error: insertMemberError } = await supabase
			.from("room_participants")
			.insert(
				{
					user_id: user.id,
					room_id: insertRoomData[0].id,
				},
				{ returning: "minimal" }
			);
		if (insertMemberError) {
			alert("Unsuccessful creation of room");
			console.log(insertMemberError);
			return;
		}
		console.log(insertRoomData);
		router.push(`/rooms/${insertRoomData[0].id}`);
	};

	const countRooms = async () => {
		const { error, count } = await supabase
			.from("rooms")
			.select("*", { head: true, count: "exact" });
		if (error) {
			console.error(error);
			return;
		}
		setCount(count);
	};

	const isUserJoined = async (roomId) => {
		const { error, count } = await supabase
			.from("room_participants")
			.select("*", { head: true, count: "exact" })
			.match({ user_id: user.id, room_id: roomId });
		if (error) {
			console.error(error);
			return true;
		}
		return count !== 0;
	};

	const fetchRooms = async () => {
		setLoading(true);
		const from = (page - 1) * pageSize;
		const to = page * pageSize - 1;
		const { data, error } = await supabase
			.from("rooms")

			.select(
				`id, name, created_by(
				username
			), created_at`
			)
			.range(from, to);
		if (error) {
			console.error(error);
			return;
		}
		setRooms(data);
		setLoading(false);
	};

	useEffect(() => {
		countRooms();
		fetchRooms();
	}, []);

	useEffect(() => {
		fetchRooms();
	}, [page]);

	const handlePageChange = (page, pageSize) => {
		setPage(page);
	};

	const showModal = (roomId) => {
		setIsModalVisible(true);
		setClickedRoom(roomId);
	};

	const handleOk = async () => {
		const joined = await isUserJoined(clickedRoom);
		if (!joined) {
			const { error } = await supabase
				.from("room_participants")
				.insert({ user_id: user.id, room_id: clickedRoom });
			if (error) {
				console.error(error);
				return;
			}
		}
		router.push(`/rooms/${clickedRoom}`);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<PageHeader />
			<Content style={{ backgroundColor: "white", padding: "2.5rem" }}>
				<Modal
					visible={isModalVisible}
					onOk={handleOk}
					onCancel={handleCancel}
					cancelText={"No"}
					okText={"Yes"}
				>
					<div>
						<Title level={3}>Do you want to enter this room?</Title>
					</div>
				</Modal>

				<Row
					align="middle"
					justify="center"
					style={{ backgroundColor: "" }}
				>
					<Col style={{ backgroundColor: "" }} span={24}>
						<List
							header={
								<Row justify="space-between">
									<Col>
										<Title>Rooms</Title>
									</Col>
									<Col>
										<Space direction="horizontal">
											<Form
												form={form}
												layout="inline"
												onFinish={createRoom}
											>
												<Form.Item name="roomName">
													<Input
														type="text"
														size="large"
														placeholder="Enter Room Name"
													/>
												</Form.Item>
												<Form.Item>
													<Button
														size="large"
														disabled={loading}
														type="primary"
														icon={
															<PlusCircleOutlined />
														}
														htmlType="submit"
													>
														Create a Room
													</Button>
												</Form.Item>
											</Form>
										</Space>
									</Col>
								</Row>
							}
							dataSource={rooms}
							size="large"
							pagination={{
								pageSize: pageSize,
								onChange: handlePageChange,
								total: count,
								position: "bottom",
								showSizeChanger: false,
								defaultCurrent: page,
							}}
							renderItem={(item) => (
								<List.Item style={{ cursor: "pointer" }}>
									<Skeleton
										avatar
										title={false}
										active
										loading={loading}
									>
										<List.Item.Meta
											onClick={() => showModal(item.id)}
											avatar={
												<Avatar size="large">
													{item.created_by.username.substring(
														0,
														2
													)}
												</Avatar>
											}
											title={
												<a href="https://ant.design">
													{item.name}
												</a>
											}
											description={
												<Row>
													<Col>
														<Text>
															{`created ${formatRelative(
																new Date(
																	item.created_at
																),
																new Date()
															)} by ${
																item.created_by
																	.username
															}`}
														</Text>
													</Col>
												</Row>
											}
										/>
									</Skeleton>
								</List.Item>
							)}
						/>
					</Col>
				</Row>
			</Content>
		</Layout>
	);
	x;
}
