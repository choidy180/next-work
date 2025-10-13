"use client";
import styled from "styled-components"
import ColGroup from "./table/ColGroup";

interface Item {
  item1: string;
  item2: string;
  item3: string;
  item4: string;
}

type HeadLike = string | { text: string };

interface Props {
  items?: Item[];
  headItems?: HeadLike[];
}

const ContentInnerFlexBasic40 = ({items = [], headItems = []}:Props) => {
  // 문자열이면 {text: '...'} 형태로 정규화
  const heads = headItems.map((h) => (typeof h === "string" ? { text: h } : h));
  return (
    <Container>
      <div className="table-container">
        <table className="basic-table" id="main-table">
          <ColGroup widths={['auto', '18%', '18%', '13%', '13%']} />
          <thead>
            <tr>
              {heads.map((content, index) => (
                <th key={index}>{content.text}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((content, index) => (
              <tr key={index}>
                <td className={`${content.item1 == '양품' ? 'success' : ''} ${content.item1 == '불량' ? 'critical' : ''}`}>{content.item1}</td>
                <td className={`${content.item2 == '양품' ? 'success' : ''} ${content.item2 == '불량' ? 'critical' : ''}`}>{content.item2}</td>
                <td className={`${content.item3 == '양품' ? 'success' : ''} ${content.item3 == '불량' ? 'critical' : ''}`}>{content.item3}</td>
                <td className={`${content.item4 == '양품' ? 'success' : ''} ${content.item4 == '불량' ? 'critical' : ''}`}>{content.item4}</td>
                <td><a href="vision_view.html" target="_blank" className="btn btn-primary w-full"><span>보기</span></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  )
}

export default ContentInnerFlexBasic40;

const Container = styled.div`
  width: 50%;

  background: #fff;
  border: 1px solid #CACADE;
  padding: 25px;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: 1280px) {
    width: 100%;
    flex-basis: auto;
  }

  .table-container {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
  }

  .basic-table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    font-size: 1rem;
    background: #fff;

    th {
      background: #E9EBF2;
      font-weight: 600;
      text-align: left;
      border-bottom: 0;
      padding: 7px 10px;
    }

    td {
      padding: 7px 10px;
      font-weight: 400;
    }

    .success {
      color: #26c951;
    }
    .critical {
      color: #f43b2a;
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 0;
    cursor: pointer;
    transition: 0.2s ease;
    border-radius: 5px;
  }

  .btn-primary {
    background-color: #ED4C54;
    color: #fff;
  }

`