import Header from "components/base/Header";
import Col from "components/layout/base/Grid/Col";
import Row from "components/layout/base/Grid/Row";
import Image from "next/image";
import React from "react";

export interface NoLinksProps {
    search?: string;
}

const NoLinks: React.VFC<NoLinksProps> = ({
	search,
}) => (
	<>
		<Row rowSpacing={5} >
			<Col xs={12} centerBlock style={{
				height: 166,
			}}>
				<Image src="/images/no_indexes.png" alt="No Indexes" layout="fill" objectFit='contain' />
			</Col>
			<Col className="text-center" centerBlock>
				{
					search ? (
						<Header level={4} style={{
							maxWidth: 350,
						}}>{`Your search "${search}" did not match any links.`}</Header>
					) : (
						<Header level={4} style={{
							maxWidth: 350,
						}}>{`No links yet.`}</Header>
					)
				}
			</Col>
		</Row>
	</>
);

export default NoLinks;
