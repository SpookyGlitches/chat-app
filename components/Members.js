import { Avatar, List, Typography } from "antd";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";
import { differenceInMinutes } from "date-fns";
import { useRouter } from "next/router";
const { Text } = Typography;

export default function Members() {
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const getMembers = async () => {
		setLoading(true);
		const { data, error } = await supabase
			.from("room_participants")
			.select(
				`id,
			 		user:user_id(
						username,
				 		id,
						avatar_url,
						last_online
						),
					room_id
				 `
			)
			.eq("room_id", router.query.id);
		if (error) alert(error.message);
		else setMembers(data);
		setLoading(false);
	};
	const handleProfileUpdate = (payload) => {
		const found = members.some((item) => item.user.id === payload.new.id);
		if (!found) return;
		getMembers();
	};

	useEffect(() => {
		if (loading) return;
		// https://github.com/supabase/supabase/issues/4195
		// i hope i can listen to many rows and not just 1
		const subscribeToProfiles = supabase
			.from("profiles")
			.on("UPDATE", (payload) => handleProfileUpdate(payload))
			.subscribe();
		return () => {
			supabase.removeSubscription(subscribeToProfiles);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading]);

	useEffect(() => {
		if (!router.isReady) return;
		getMembers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	const renderOnlineStatus = (date) => {
		// if the user's last online time is greater than 2 minutes
		// we'll say that they're offline
		if (differenceInMinutes(new Date(), date) > 2) {
			return <Text type="secondary">offline</Text>;
		} else {
			return <Text type="success">online</Text>;
		}
	};

	return (
		<List
			itemLayout="horizontal"
			dataSource={members}
			renderItem={(item) => (
				<List.Item>
					<List.Item.Meta
						avatar={
							<Avatar>
								{item.user.username.substring(0, 2)}
							</Avatar>
						}
						title={<Text>{item.user.username}</Text>}
						description={renderOnlineStatus(
							new Date(item.user.last_online)
						)}
					/>
				</List.Item>
			)}
		></List>
	);
}
