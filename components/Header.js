import { Layout } from "antd";
import { useState, useContext } from "react";
import { Input, Row, Col, Space, Button, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { supabase } from "../utils/supabaseClient";

export default function Header() {
	const [form] = Form.useForm();
	const user = supabase.auth.user();
	console.log(user);
	const createRoom = async (values) => {
		const { data, error } = await supabase
			.from("rooms")
			.insert({ created_by: user.id, name: values.roomName });
		console.log(data, error);
	};
	return (
		<Layout.Header
			style={{
				color: "white",
				display: "flex",
				alignItems: "center",
			}}
		>
			<Row
				justify="space-between"
				style={{
					width: "100%",
				}}
			>
				<Col>
					<span>Welcome to my Chat App</span>
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
									type="primary"
									icon={
										<PlusCircleOutlined />
									}
									htmlType="submit"
								>
									Create a
									Room
								</Button>
							</Form.Item>
						</Form>
					</Space>
				</Col>
			</Row>
		</Layout.Header>
	);
}
