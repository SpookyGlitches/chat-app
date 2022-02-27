import { supabase } from "../utils/supabaseClient";
import React, { useEffect, useState, useRef } from "react";
import { formatRelative, isSameDay, format } from "date-fns";
import {
	Row,
	Col,
	Space,
	Typography,
	Divider,
	List,
	Avatar,
	Menu,
	Layout,
	Skeleton,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";

const { Text } = Typography;

const Messages = () => {
	const [limit, setLimit] = useState(10);
	const [hasMore, setHasMore] = useState(false);
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const { query, isReady } = router;

	const resetValues = () => {
		setLimit(10);
		setHasMore(false);
		setLoading(false);
		setMessages([]);
	};

	const fetchMessages = async () => {
		if (loading) return;
		else setLoading(true);

		const { data, error, count } = await supabase
			.from("messages")
			.select(
				`
				id,
				created_at,
				content,
				created_by(
					username
				)
				`,
				{ count: "exact" }
			)
			.limit(limit)
			.order("created_at", { ascending: false })
			.eq("room_id", query.id);

		if (error) {
			alert(error.message);
			return;
		}

		data.reverse();
		console.log("count",count)
		console.log("messages", messages)
		if(count < limit){
			setHasMore(false)
		}else{
			setHasMore(true)
			setLimit(prevState => prevState + 10)
		}
		setMessages(data);
		setLoading(false);
	};

	// not sure how this works
	let dateL = null;

	const addIncomingMessage = (message) => {
		// there's probably a bug here at 11:59 pm - ??
		setMessages((prevState) => [...prevState, message]);
	};

	const handleIncomingMessage = async (payload) => {
		const { data, error } = await supabase
			.from("messages")
			.select(
				`
					id,
					created_at,
					room_id,
					content,
					created_by(
						username
					)
			`
			)
			.match({ id: payload.new.id, room_id: query.id })
			.limit(1)
			.maybeSingle();

		if (error || !data) {
			alert("Unable to retrieve the message.");
			console.log(error || "No data");
			return;
		}
		addIncomingMessage(data);
	};

	const renderMessage = (element) => {
		const dateR = new Date(element.created_at);
		// i think this is super wrong :(
		if (!dateL || !isSameDay(dateL, dateR)) {
			dateL = dateR;
			return (
				<React.Fragment key={element.id}>
					<Divider plain orientation="center">
						{format(dateL, "MMMM d, yyyy  ")}
					</Divider>
					<Message data={element} />
				</React.Fragment>
			);
		}

		dateL = dateR;
		return (
			<React.Fragment key={element.id}>
				<Message data={element} />
			</React.Fragment>
		);
	};

	useEffect(() => {
		if (!router.isReady) return;
		fetchMessages();
		const subscribeToMessages = supabase
			.from(`messages:room_id=eq.${router.query.id}`)
			.on("INSERT", handleIncomingMessage)
			.subscribe();
		return () => {
			resetValues();
			supabase.removeSubscription(subscribeToMessages);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	return (
		<div
			id="scrollableDiv"
			style={{
				height: "100%",
				overflow: "auto",
				display: "flex",
				backgroundColor: "white",
				flexDirection: "column-reverse",
				padding: "2rem",
				border: 0,
			}}
		>
			<InfiniteScroll
				dataLength={messages.length}
				next={() => fetchMessages()}
				style={{
					display: "flex",
					flexDirection: "column-reverse",
					overflow: "hidden",
				}}
				bordered={false}
				inverse={true}
				hasMore={hasMore}
				loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
				endMessage={<Divider plain>End 😀</Divider>}
				scrollableTarget="scrollableDiv"
			>
				<List
					bordered={false}
					dataSource={messages}
					renderItem={(item) => (
						<List.Item key={item.id} style={{ display: "block" }}>
							{renderMessage(item)}
						</List.Item>
					)}
				/>
			</InfiniteScroll>
		</div>
	);
};

const Message = ({ data }) => {
	return (
		<Row wrap={false} align="top" gutter={8}>
			<Col>
				<Avatar size="large">
					{data.created_by.username.substring(0, 2)}
				</Avatar>
			</Col>
			<Col>
				<Row gutter={6}>
					<Col>
						<Text strong>{data.created_by.username}</Text>
					</Col>
					<Col>
						<Text type="secondary">
							{formatRelative(
								new Date(data.created_at),
								new Date()
							)}
						</Text>
					</Col>
				</Row>
				<Row>
					<Row>
						<Col
							style={{
								whiteSpace: "pre-wrap",
								wordBreak: "break-all",
							}}
						>
							{data.content}
						</Col>
					</Row>
				</Row>
			</Col>
		</Row>
	);
};

export default Messages;
