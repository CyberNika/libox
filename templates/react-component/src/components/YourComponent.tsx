import React, { FC, useState } from "react";

export interface <%= componentName %>Props {
  visible?: boolean;
  children: React.ReactNode;

  onClick: (evt: React.MouseEvent) => void;
}

const <%= componentName %>: FC<<%= componentName %>Props> = ({ children, visible, onClick }) => {
  const [innerVisible, setInnerVisible] = useState(visible);

  return (
    <div onClick={onClick} className="<%= name %>">
      {innerVisible}
      {children}
    </div>
  );
};

export default <%= componentName %>;
