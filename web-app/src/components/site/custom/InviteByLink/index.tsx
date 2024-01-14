import React from "react";
import Text from "components/base/Text";
import Row from "components/layout/base/Grid/Row";
import Col from "components/layout/base/Grid/Col";
import Select from "components/base/Select";
import Option from "components/base/Select/Option";
import Button from "components/base/Button";
import InviteByLinkItem from "./InviteByLinkItem";

export interface InviteByLinkProps { }

const InviteByLink: React.VFC<InviteByLinkProps> = () => (
	<Row
		rowSpacing={3}
	>
		<Col xs={12}>
			<Text className="mt-2 mb-0" element="p" fontWeight={600}>Invite collaborators by link</Text>
		</Col>
		<Col xs={8} sm={9}>
			<Select
				value="view"
				bordered
			>
				<Option value="view"><Text fontWeight={500}>Anyone with the link can view</Text></Option>
				<Option value="edit"><Text fontWeight={500}>Anyone with the link can edit</Text></Option>
			</Select>
		</Col>
		<Col
			xs={4}
			sm={3}
			className="pl-5"
		>
			<Button block theme="clear">
				Create link
			</Button>
		</Col>
		{[1, 2, 3].map((inv) => <Col key={inv} xs={12}><InviteByLinkItem editor={inv === 1} /></Col>)}
	</Row>
);

export default InviteByLink;
