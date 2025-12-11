"use client";
import PlantLayout from "@/components/factory";
import DynamicFullScreenGlbViewer from "@/components/full-screen-glb-viewer";
import PlantLayoutComp from "@/components/icons/PlantLayout";
import PlantLayoutDataDriven from "@/components/icons/PlantLayoutDataDriven";
import PlantCanvas from "@/components/PlantCanvas";
import styled from "styled-components";


export default function Home() {
  const modelPath: string = '/test-v1.glb';
  return (
    <Section>
      {/* <PlantLayout width="100%" height="auto" ariaLabel="공정 배치도" /> */}
      {/* <PlantLayout/> */}
      {/* <PlantLayoutComp/> */}
      {/* <PlantLayoutDataDriven/> */}
      {/* <PlantCanvas/> */}
      <DynamicFullScreenGlbViewer glbUrl={modelPath} />
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