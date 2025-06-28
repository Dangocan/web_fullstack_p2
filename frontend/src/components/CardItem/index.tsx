import React from "react";
import { useDialog } from "../../contexts/DialogContext";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  item: {
    awardYear?: number;
    dateAwarded?: string;
    category: {
      en?: string;
    };
    laureates: {
      fullName?: {
        id?: string;
        en?: string;
      };
      orgName?: {
        id?: string;
        en?: string;
      };
    }[];
  };
}

function CardItem({ item }: IProps) {
  const { openDialog } = useDialog();
  return (
    <li
      className="border-1 rounded border-zinc-400 bg-zinc-200 shadow-lg flex flex-col justify-center m-2 h-min p-4"
      onClick={() => openDialog(item)}
    >
      <span className="flex items-center">
        <p className="pr-1 font-semibold">Category:</p>
        {item?.category.en}
      </span>
      <span className="flex items-center">
        <p className="pr-1 font-semibold">Date:</p>
        {item?.dateAwarded || "Sem data"}
      </span>
      <span className="flex items-center">
        <p className="pr-1 font-semibold">Laureates:</p>
        {item?.laureates?.length > 1 ? (
          <span className="flex items-center">
            {item?.laureates[0]?.fullName?.en}
            <p className="ml-2 p-2 rounded-full font-semibold border-1 bg-zinc-500 text-neutral-100">
              {" +" + item?.laureates?.length}
            </p>
          </span>
        ) : item?.laureates[0]?.fullName?.en ? (
          item?.laureates[0]?.fullName?.en
        ) : item?.laureates[0]?.orgName?.en ? (
          item?.laureates[0]?.orgName?.en
        ) : (
          ""
        )}
      </span>
    </li>
  );
}

export default CardItem;
