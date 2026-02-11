// Reusable column factory functions
export const createStatusColumn = (dataIndex: string, width: number = 80) => {
  return {
    title: "Status",
    dataIndex,
    key: dataIndex,
    width,
    align: "center" as const,
    render: (value: any) => {
      if (
        value === "P" ||
        value === true ||
        String(value ?? "").toUpperCase() === "YES"
      ) {
        return "✓";
      }
      if (
        value === "O" ||
        value === false ||
        String(value ?? "").toUpperCase() === "NO"
      ) {
        return "✗";
      }
      return null;
    },
  };
};

export const createScoreColumn = (
  dataIndex: string,
  title: string,
  width: number = 80,
  handlers?: any,
  editingKeys?: string[],
) => {
  return {
    title,
    dataIndex,
    key: dataIndex,
    width,
    render: (text: string, record: any) => {
      // This will be replaced with your actual renderEditableInput function
      return text || "-";
    },
  };
};

export const createScaleColumn = (
  dataIndex: string,
  scaleOptions?: any[],
  handlers?: any,
  editingKeys?: string[],
) => {
  return {
    title: "Scale",
    dataIndex,
    key: dataIndex,
    width: 60,
    render: (text: any) => {
      return text || "-";
    },
  };
};

export const createRatingColumn = (
  dataIndex: string,
  ratingOptions?: any[],
  handlers?: any,
  editingKeys?: string[],
) => {
  return {
    title: "Rating",
    dataIndex,
    key: dataIndex,
    width: 120,
    render: (text: any) => {
      return text || "-";
    },
  };
};
