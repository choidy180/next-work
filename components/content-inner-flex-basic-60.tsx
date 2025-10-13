"use client";
import styled from "styled-components"

interface Item {
  title: string;
  image: string;
}

interface ItemProps {
  items: Item[];
}

const ContentInnerFlexBasic60 = ({ items }: ItemProps) => {
  return (
    <Container>
      {
        items.map((content, index) => (
          <div key={index} className="camera-item">
            <div className="camera-header">
              <h3 className="camera-title">
                {content.title}
              </h3>
            </div>
            <div className="camera-view">

            </div>
          </div>
        ))
      }
    </Container>
  )
}

export default ContentInnerFlexBasic60;

const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  
  width: 50%;
  padding: 25px;
  background: #fff;
  border: 1px solid #CACADE;

  @media (max-width: 1280px) {
    width: 100%;
    flex-basis: auto;
    padding: 15px;
  }

  .camera-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .camera-header {
    background-color: #E9EBF2;
    padding: 10px;
  }
  .camera-title {
    font-size: 1rem;
    font-weight: 600;
    color: #18181A;
  }
  .camera-view {
    background-color: #000;
    overflow: hidden;
    aspect-ratio: 4 / 3;
  }
  .camera-view img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`