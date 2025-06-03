import React from "react";
interface SubHeaderProps {
  filterText: string;
  handleFilterTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
}

const SubHeaderRender: React.FC<SubHeaderProps> = ({
  filterText,
  handleFilterTextChange,
  handleClear,
}) => {
  return (
    <div className="flex flex-row space-x-4 items-center">
      <div className=" flex flex-row space-x-2">
        <input
          placeholder="Search"
          onChange={handleFilterTextChange}
          value={filterText}
          className="rounded "
        />
        <button className="btn btn-primary" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SubHeaderRender;
