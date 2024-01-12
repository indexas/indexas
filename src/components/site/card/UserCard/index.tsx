import Avatar from "components/base/Avatar";
import Text from "components/base/Text";
import SelectUserRight from "components/site/select/SelectUserRight";
import Col from "components/layout/base/Grid/Col";
import Flex from "components/layout/base/Grid/Flex";
import FlexRow from "components/layout/base/Grid/FlexRow";
import React from "react";
import { UserRightType } from "types";

export interface UserCardProps {
	showUserRight?: boolean;
	title?: string;
	subtitle?: string;
	className?: string;
	hoverable?: boolean;
	owner?: boolean;
	right?: UserRightType;
	onRightsChanged?(newRight: UserRightType): void;
}

const UserCard: React.VFC<UserCardProps> = ({
	title,
	subtitle,
	right,
	showUserRight = false,
	owner = false,
	className,
	onRightsChanged,
}) => (
	<FlexRow align="center" className={className}>
		<Col>
			<Avatar size={40}>Y</Avatar>
		</Col>
		<Col className="idxflex-grow-1 ml-6">
			<Flex flexDirection="column">
				<Text>{title}</Text>
				<Text size="sm" theme="secondary">{subtitle}</Text>
			</Flex>
		</Col>
		{
			showUserRight && (
				<Col>
					{
						owner ? (
							<Text theme="secondary" fontWeight={500} size="sm">Owner</Text>
						) :
							(
								<SelectUserRight value={right} onChange={onRightsChanged} />
							)
					}
				</Col>
			)
		}

	</FlexRow>
);

export default UserCard;
