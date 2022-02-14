import React, {
	ReactElement, useEffect, useRef, useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import cc from "classcat";
import DraggableListItem from "./DraggableListItem";

export interface IndexedDraggableListData<T = {}> {
	data: T;
}

export interface DraggableListProps<T = {}> {
	data: T[];
	listClass?: string;
	itemContainerClass?: string;
	render(item: T, index: number): ReactElement<any>;
}

const DraggableList: React.VFC<DraggableListProps> = ({
	data,
	listClass,
	itemContainerClass,
	render,
}) => {
	const [listData, setListData] = useState(data);
	const containerId = useRef<string>(uuidv4());

	useEffect(() => {
		setListData(data);
	}, [data]);

	const reorderItems = (draggedItemOrder: number, newOrder: number) => {
		setListData((oldListData) => {
			const tempListData = [...oldListData];
			const draggedItem = tempListData[draggedItemOrder];
			tempListData.splice(draggedItemOrder, 1);
			tempListData.splice(newOrder, 0, draggedItem);
			return tempListData;
		});
	};

	const handlePositionChange = (cId: string, draggedItemOrder: number, newOrder: number) => {
		reorderItems(draggedItemOrder, newOrder);
	};

	return (
		<ul className={
			cc([
				"idx-draggable-list",
				listClass || "",
			])
		}>
			{
				listData.map((item, index) => (
					<DraggableListItem
						key={uuidv4()}
						className={itemContainerClass}
						containerId={containerId.current}
						order={index}
						onPositionChanged={handlePositionChange}
					>
						{render(item, index)}
					</DraggableListItem>
				))
			}
		</ul>
	);
};

export default DraggableList;
