type ColWidth = string | number; 

interface ColGroupProps {
  widths: ColWidth[];
}

export default function ColGroup({ widths }: ColGroupProps) {
  return (
    <colgroup>
      {widths.map((w, i) => {
        const width = typeof w === 'number' ? `${w}%` : w;
        return <col key={i} style={{ width }} />;
      })}
    </colgroup>
  );
}