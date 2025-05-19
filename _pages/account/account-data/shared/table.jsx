"use client";
import { truncateText } from "@/helpers/strings";
import { icons } from "@/_lib/icons";

export const Table = ({ fields, data, onClick, className = "" }) => {
  const handleTableCellText = (field, row) => {
    if (field.type == "YES_NO")
      return Number(row?.[field?.name]) === 1 ? "Da" : "Ne";

    if (field.type == "set_short_text")
      return row[field.name]
        ? truncateText(row[field.name], 120)
        : row[field.name];

    switch (field?.name) {
      case "set_default":
        return Number(row?.[field?.name]) === 1 ? "Da" : "Ne";
      default:
        return row?.[field?.name];
    }
  };

  return (
    <div className={`mt-10 w-full shadow ${className}`}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-300 text-black">
            {(fields ?? [])?.map((field) => (
              <th
                key={`head-${field?.id}`}
                className="border-b px-4 py-2 text-sm font-normal"
              >
                {field?.placeholder}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data ?? [])?.map((row, index) => {
            return (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "!bg-gray-50" : "bg-white"}`}
              >
                {(fields ?? [])?.map((field) => (
                  <td
                    key={`body-${field?.id}`}
                    className={`border-b px-4 py-2 text-center text-sm${
                      field?.name == "actions" ? "w-[32px]" : ""
                    }`}
                  >
                    {field?.name !== "actions"
                      ? handleTableCellText(field, row)
                      : Actions(field?.actions, row, onClick)}
                  </td>
                ))}
              </tr>
            );
          })}

          {data && data.length === 0 && (
            <tr>
              <td
                className="border-b px-4 py-2 text-center text-sm"
                colSpan={fields.length}
              >
                Nema podataka za prikaz
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Actions = (actions, row, onClick) => {
  let all_actions = (actions ?? "-").split("-");

  return (
    <div
      colSpan={all_actions?.length}
      className="flex items-center justify-end gap-2 py-4 text-right"
    >
      {(all_actions ?? [])?.map((action, index) => {
        return (
          <button
            onClick={() => {
              onClick(action, row);
            }}
            key={index}
            className={`${
              action?.color ?? "text-black"
            } hover:text-blue- hover:underline w-[1.3rem]${
              row.disabled ? "cursor-auto opacity-20" : ""
            }`}
          >
            {icons?.[action]}
          </button>
        );
      })}
    </div>
  );
};
