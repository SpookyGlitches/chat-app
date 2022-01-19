import { Layout } from "antd";
import { Menu } from "antd";
import { supabase } from "../utils/supabaseClient";
import React, { useEffect, useState, useRef } from "react";
import { List, Avatar } from "antd";
import { formatRelative, isSameDay, format } from "date-fns";
import { Row, Col, Space, Typography, Divider } from "antd";
import InfiniteScroll from "react-infinite-scroller";

const { Text } = Typography;

const Messages = function MessagesList({ pickedRoom }) {
	const paginationDefault = { start: 0, end: 20 };
	const [messages, setMessages] = useState([]);
	const [pagination, setPagination] = useState(paginationDefault);
	const [hasMore, setHasMore] = useState(true);
	const resetValues = () => {
		setPagination(paginationDefault);
		setHasMore(true);
	};
	const fetchMessages = async () => {
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
			.range(pagination.start, pagination.end)
			.order("created_at")
			.eq("room_id", pickedRoom.id);
		if (error) {
			setHasMore(false);
			return;
		}
		console.log("count", count);
		setPagination((prevState) => {
			setHasMore(pagination.end < count);
			return { start: prevState.end, end: prevState.end + 40 };
		});
		console.log(data);
		setMessages(data);
	};

	const addIncomingMessage = (message) => {
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
			.match({ id: payload.new.id, room_id: payload.new.room_id })
			.limit(1)
			.single();

		if (error) {
			alert("74", error.message);
			return;
		}
		addIncomingMessage(data);
	};

	useEffect(() => {
		console.log("changed");
		resetValues();
		// fetchMessages();
		const subscribeToMessages = supabase
			.from("messages")
			.on("INSERT", handleIncomingMessage)
			.subscribe();
		return () => supabase.removeSubscription(subscribeToMessages);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pickedRoom]);
	// useEffect(() => {
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
	const renderMessages = () => {
		let dateL = null;
		const items = messages.map((element) => {
			const dateR = new Date(element.created_at);
			if (!isSameDay(dateL, dateR)) {
				dateL = dateR;
				return (
					// this is probably wrong
					<React.Fragment key={element.id}>
						<Divider plain orientation="center">
							{format(dateL, "MMMM d, yyyy  ")}
						</Divider>
						<Message data={element} />
					</React.Fragment>
				);
			}
			dateL = dateR;
			return <Message data={element} key={element.id} />;
		});
		return items;
	};

	return (
		<div
			style={{
				overflowX: "hidden",
				overflowY: "auto",
				padding: "1.5rem 2.5rem",
				backgroundColor: "white",
			}}
		>
			<InfiniteScroll
				useWindow={false}
				loadMore={() => fetchMessages()}
				hasMore={hasMore}
				isReverse={true}
				initialLoad={true}
				loader={
					<div className="loader" key={0}>
						Loading ...
					</div>
				}
			>
				{/* <Space
					direction="vertical"
					size="large"
					style={{ width: "100%" }}
				> */}
				{renderMessages()}
				{/* </Space> */}
			</InfiniteScroll>
		</div>
	);
};

export default Messages;
