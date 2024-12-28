import React from "react";
import { Card } from "../utils/cardUtils";
import Nameplate from "./Nameplate";

interface PrintViewProps {
  cards: Card[];
}

const PrintView: React.FC<PrintViewProps> = ({ cards }) => {
  return (
    <div className="hidden print:block">
      <style jsx global>
        {`
          @media print {
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .print-card {
              page-break-inside: avoid;
            }
          }
        `}
      </style>
      <div className="grid grid-cols-2 gap-4 px-4">
        {cards.map((card) => (
          <div key={card.id} className="print-card">
            <Nameplate name={card.value} width="210mm" height="99mm" fontSize="80px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintView;

