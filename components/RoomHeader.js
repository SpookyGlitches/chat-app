import { PageHeader, Tag, Button, Statistic, Descriptions, Row } from "antd";
export default function RoomHeader({ roomName, roomCreator }) {
	return (
		<PageHeader
			title={roomName}
			subTitle={`created by ${roomCreator}`}
		></PageHeader>
	);
}
