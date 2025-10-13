"use client";
import ContentInnerFlexBasic40 from "@/components/content-inner-flex-basic-40";
import ContentInnerFlexBasic60 from "@/components/content-inner-flex-basic-60";
import styled from "styled-components";

const items = [
  {title: 'Vision Camera_1', image: ''},
  {title: 'Vision Camera_2', image: ''}
]

const items2 = [
  {
    item1: '2025-08-07 01:23:45', item2: '양품', item3: '양품', item4: '양품'
  },
  {
    item1: '2025-08-05 01:23:45', item2: '양품', item3: '불량', item4: '불량'
  },
]

const head = ['시간', '1번 카메라', '2번 카메라', '양/불', '보기'];

export default function Home() {
  return (
    <Section>
      <ContentInnerFlexBasic60 items={items}/>
      <ContentInnerFlexBasic40 headItems={head} items={items2}/>
    </Section>
  );
}

const Section = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  flex: 1;

  @media (max-width: 1280px) {
    gap: 15px;
    display: flex;
    flex-direction: column;
}
`