import List from "components/base/List";
import { useRouter } from "next/router";
import React, {
	useCallback, useEffect, useState, useRef, ReactElement
} from "react";
import api, { IndexSearchResponse } from "services/api-service";
import { Indexes } from "types/entity";
import InfiniteScroll from "react-infinite-scroller";
import { useMergedState } from "hooks/useMergedState";
import { useOwner } from "hooks/useOwner";
import IndexItem from "../IndexItem";
import NoIndexes from "../NoIndexes";
import NotFound from "../NotFound";
import ListItem from "../../../base/List/ListItem"

export interface IndexListProps {
	shared: boolean;
	search?: string;
	onFetch?(loading: boolean): void;
}

const take = 10;

export interface IndexListState {
	dt: IndexSearchResponse;
	skip: number;
	take: number;
	search?: string;
	hasMore: boolean;
}



import { v4 as uuidv4 } from "uuid";
import cc from "classcat";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";


export interface ListProps<T = {}> {
	data: T[];
	listClass?: string;
	itemContainerClass?: string;
	render(item: T, index: number, provided?: DraggableProvided, snapshot?: DraggableStateSnapshot): ReactElement<any>;
	divided?: boolean;
	draggable?: boolean;
	placeholder?: any;
	droppableProvided?: any,
}

const List2: React.VFC<ListProps> = ({
										data,
										listClass,
										itemContainerClass,
										render,
										divided = true,
										draggable = false,
										placeholder,
										droppableProvided,
									}) => {
	const containerId = useRef<string>(uuidv4());

	return (
		<ul
			ref={droppableProvided?.innerRef}
			{...droppableProvided?.droppableProps}
			className={
				cc([
					"list",
					listClass || "",
				])
			}>
			{
				data.map((item, index) => (!draggable ? (
					<ListItem
						key={`listItem${index}-${containerId}`}
						className={cc([
							itemContainerClass || "",
						])}
					>
						{render(item, index)}
						{divided && index !== data.length - 1 && <div className="list-divider"></div>}
					</ListItem>
				) : (
					<Draggable
						key={(item as any).id}
						index={index}
						draggableId={(item as any).id}>
						{(provided, snapshot) => <ListItem
							provided={provided}
							className={cc([
								itemContainerClass || "",
							])}
						>
							{render(item, index, provided, snapshot)}
							{divided && index !== data.length - 1 && <div className="list-divider"></div>}
						</ListItem>}</Draggable>
				)))
			}
			{
				droppableProvided?.placeholder
			}
		</ul>
	);
};


const IndexList: React.VFC<IndexListProps> = ({ shared, search, onFetch }) => {
	const [state, setState] = useMergedState<IndexListState>({
		dt: {
			records: [],
		},
		skip: 0,
		take: 10,
		search,
		hasMore: true,
	});
	const [loading, setLoading] = useState(false);
	const [init, setInit] = useState(false);
	const [hasIndex, setHasIndex] = useState(true);
	const router = useRouter();

	const { isOwner, did } = useOwner();

	const getData = async (page?: number, reset?: boolean, searchT?: string) => {
		setLoading(true);

		const res = await api.searchIndex({
			skip: reset ? 0 : state.skip,
			take: state.take,
			did: "did:key:z6Mkw8AsZ6ujciASAVRrfDu4UbFNTrhQJLV8Re9BKeZi8Tfx",
		});
		console.log(res)
		if (res) {
			setState((oldState) => ({
				hasMore: false, // res.totalCount! > res.search!.skip! + take,
				dt: {
					records: reset ? (res.records || []) : [...oldState.dt.records!, ...(res.records ?? [])],
				},
				skip: reset ? oldState.take : oldState.skip + oldState.take,
			}));
		}
		setLoading(false);
		if (!init) {
			setHasIndex(!!(res?.records && res.records.length > 0));
			setInit(true);
		}
	};

	const handleClick = useCallback((itm: Indexes) => async () => {
		router.push(`/${router.query.did}/${itm.streamId}`);
	}, []);

	const handleDelete = () => {
		getData(undefined, true);
	};

	useEffect(() => {
		getData(undefined, true, search);
	}, [search]);

	useEffect(() => {
		onFetch && onFetch(loading);
	}, [loading]);
	return (
		<>
			<InfiniteScroll
				initialLoad={false}
				hasMore={state.hasMore}
				loadMore={getData}
				marginHeight={50}
			>
				<List2
					data={state.dt?.records || []}
					listClass="index-list"
					render={(itm: Indexes) => <IndexItem
						hasSearch={!!search}
						onClick={handleClick(itm)}
						onDelete={handleDelete}
						{...itm}
					/>}
					divided
				/>
			</InfiniteScroll>
		</>
	);
};

export default IndexList;
