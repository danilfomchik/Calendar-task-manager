import { useMemo } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";

import Column from "../Column";
import { deleteColumn } from "@/redux/columns/columnsSlice";
import { TId } from "@/redux/columns/types";
import { selectColumns } from "@/redux/columns/selectors";

const ColumnsList = () => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);

  const columnsIds = useMemo(
    () => columns.map((column) => column.id),
    [columns],
  );

  const onDeleteColumn = (columnId: TId) => {
    dispatch(deleteColumn(columnId));
  };

  return (
    <div className="grid grid-cols-auto-fill gap-4 w-full">
      <SortableContext items={columnsIds}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onDeleteColumn={onDeleteColumn}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default ColumnsList;
