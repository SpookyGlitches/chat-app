import { Avatar, List, Typography } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";
const { Text } = Typography;

export default function Members({ roomId }) {
	const [members, setMembers] = useState([]);
	const getMembers = async () => {
		const { data, error } = await supabase
			.from("room_participants_view")
			.select()
			.eq("rp_room_id", roomId.toString());
		if (error) {
			alert(error.message);
			// console.log(error);
		}
		// console.log(data);
		setMembers(data);
	};
	useEffect(() => {
		getMembers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomId]);

	return (
		<List
			itemLayout="horizontal"
			dataSource={members}
			renderItem={(item) => (
				<List.Item>
					<List.Item.Meta
						avatar={
							<Avatar>
								{item
									.username[0] +
									item
										.username[1]}
							</Avatar>
						}
						title={
							<Text>
								{item.username}
							</Text>
						}
						description={
							<Text type="success">
								online
							</Text>
						}
					/>
				</List.Item>
			)}
		></List>
	);
}
