import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
	Row,
	Col,
	Typography,
	Input,
	Space,
	Button,
	Form,
	notification,
} from "antd";

const { Title, Text } = Typography;

export default function Auth() {
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const handleLogin = async (values) => {
		try {
			setLoading(true);
			const { error } = await supabase.auth.signIn({
				email: values.email,
			});
			if (error) throw error;
			notification["success"]({
				message: "Success",
				description: "Check your email for the login link",
			});
		} catch (error) {
			notification["error"]({
				message: "Success",
				description: error.error_description || error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Row style={{ minHeight: "100vh" }} align="middle" justify="center">
			<Col>
				<Space direction="vertical" size="large">
					<Title>Supabase + Next.js</Title>
					<Text>Sign in via magic link with your email below</Text>
					<Form form={form} onFinish={handleLogin}>
						<Form.Item name="email">
							<Input
								placeholder="john.doe@email.xyz"
								type="email"
							/>
						</Form.Item>
						<Form.Item>
							<Button
								block
								disabled={loading}
								size="large"
								type="primary"
								htmlType="submit"
							>
								Sign In
							</Button>
						</Form.Item>
					</Form>
				</Space>
			</Col>
		</Row>
	);
}
