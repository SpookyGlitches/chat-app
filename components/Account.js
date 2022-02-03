import { Layout, Row, Col, Input, Form, Button, Typography } from "antd";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import PageHeader from "./PageHeader";

export default function Account() {
	const [loading, setLoading] = useState(true);
	const session = supabase.auth.session();
	const [form] = Form.useForm();

	useEffect(() => {
		getProfile();
	}, [session]);

	async function getProfile() {
		form.setFieldsValue({ email: session.user.email });
		try {
			setLoading(true);
			const user = supabase.auth.user();
			let { data, error, status } = await supabase
				.from("profiles")
				.select(`username`)
				.eq("id", user.id)
				.single();

			if (error && status !== 406) {
				throw error;
			}
			console.log(error);
			console.log(status);
			if (data) {
				form.setFieldsValue({
					username: data.username,
				});
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	}

	async function updateProfile({ username }) {
		try {
			setLoading(true);
			const user = supabase.auth.user();

			const updates = {
				id: user.id,
				username,
				updated_at: new Date(),
			};

			let { error } = await supabase.from("profiles").upsert(updates, {
				returning: "minimal", // Don't return the value after inserting
			});

			if (error) {
				throw error;
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Layout>
			<PageHeader />
			<Layout.Content
				style={{ padding: "2.5rem", backgroundColor: "white" }}
			>
				<Row align="middle" justify="center">
					<Col>
						<Form
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}
							form={form}
							onFinish={updateProfile}
						>
							<Form.Item label="Email" name="email">
								<Input type="email" disabled />
							</Form.Item>
							<Form.Item label="Username" name="username">
								<Input type="text" />
							</Form.Item>
							<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
								<Button
									disabled={loading}
									type="primary"
									htmlType="submit"
								>
									Update
								</Button>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}
