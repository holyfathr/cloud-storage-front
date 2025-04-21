import React from "react";
import styles from "./FileActions.module.scss";
import { Button, Popconfirm } from "antd";
import { CloudDownloadOutlined, DeleteOutlined } from "@ant-design/icons";

interface FileActionsProps {
  onClickRemove: VoidFunction;
  onClickDownload: VoidFunction;
  isActive: boolean;
}

export const FileActions: React.FC<FileActionsProps> = ({
  onClickRemove,
  onClickDownload,
  isActive,
}) => {
  return (
    <div className={styles.root}>
      <Button onClick={onClickDownload} disabled={!isActive} icon={<CloudDownloadOutlined />}>
        Скачать
      </Button>

      <Popconfirm
        title="Удалить файл(ы)?"
        description="Все файлы будут перемещены в корзину"
        okText="Да"
        cancelText="Нет"
        disabled={!isActive}
        onConfirm={onClickRemove}
      >
        <Button disabled={!isActive} type="primary" danger icon={<DeleteOutlined />}>
          Удалить
        </Button>
      </Popconfirm>
    </div>
  );
};
