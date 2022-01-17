import { Layout, Typography } from "antd";
import { useState, useContext } from "react";
import { Input, Row, Col, Space, Button, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { supabase } from "../utils/supabaseClient";

export default function Header() {
	const [form] = Form.useForm();
	const user = supabase.auth.user();

	const createRoom = async (values) => {
		if (!values.roomName || values.roomName.length == 0) return;

		const { data: insertRoomData, error: insertRoomError } = await supabase
			.from("rooms")
			.insert({
				created_by: user.id,
				name: values.roomName,
			});

		if (insertRoomError) alert("Unable to create room. Try again.");
		// oh no, supabase doesn't have any transactions
		const { data: insertMemberData, error: insertMemberError } =
			await supabase.from("room_participants").insert({
				user_id: user.id,
				room_id: insertRoomData[0].id,
			});
		if (insertMemberError) console.log(insertMemberError);
	};

	return (
		<Layout.Header>
			<Row
				justify="space-between"
				style={{
					width: "100%",
				}}
			>
				<Col>
					<Typography.Text style={{ color: "white" }}>
						Welcome to my Chat App
					</Typography.Text>
					{/* <Button
						onClick={async () => {
							await supabase.auth.signOut();
						}}
					>
						Sign Out
					</Button> */}
				</Col>
				<Col>
					<Space direction="horizontal">
						<Form form={form} layout="inline" onFinish={createRoom}>
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
									type="primary"
									icon={<PlusCircleOutlined />}
									htmlType="submit"
								>
									Create a Room
								</Button>
							</Form.Item>
						</Form>
					</Space>
				</Col>
			</Row>
		</Layout.Header>
	);
}
