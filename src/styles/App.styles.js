import styled from 'styled-components';
export const Container = styled.div `
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 80px;
  padding-bottom: 80px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
`;
export const Header = styled.header `
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;
export const Title = styled.h1 `
  font-size: 20px;
  font-weight: 500;
`;
export const IconButton = styled.button `
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
`;
export const ChatBubble = styled.div `
  background-color: ${props => props.isAI ? '#fff' : 'rgb(61, 181, 242)'};
  color: ${props => props.isAI ? '#333' : 'white'};
  padding: 12px 16px;
  border-radius: ${props => props.isAI ? '20px' : '8px 8px 0 8px'};
  margin-bottom: 20px;
  display: block;
  float: right;
  width: fit-content;
  text-align: ${props => props.isAI ? 'left' : 'right'};
  clear: both;
`;
export const AssistantInfo = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #666;
`;
export const ProductsContainer = styled.div `
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin: 20px 0;
  width: 100%;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding: 8px 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;
export const ProductCard = styled.div `
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 220px;
  height: 292px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
`;
export const ProductImageContainer = styled.div `
  width: 100%;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  background: #f5f5f5;
`;
export const ProductImage = styled.img `
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
export const ProductName = styled.h3 `
  font-size: 16px;
  margin-bottom: 4px;
  font-weight: 400;
  color: #26313A;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
  max-height: 2.4em;
  word-wrap: break-word;
  white-space: normal;
  width: 100%;
`;
export const ProductUnit = styled.p `
  color: #647887;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 12px;
`;
export const StockInfo = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 2px;
  font-size: 12px;
  font-weight: 400;
  color: ${props => props.inStock ? '#26313A' : '#26313A'};

  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: ${props => props.inStock
    ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2314D055'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E\")"
    : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EE0000'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'/%3E%3C/svg%3E\")"};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;
export const Location = styled.div `
  width: 100%;
  margin: 20px 0;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: block;
  clear: both;
`;
export const FeedbackContainer = styled.div `
  margin: 20px 0;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;
export const FeedbackQuestion = styled.p `
  color: #333;
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 500;
`;
export const FeedbackButtons = styled.div `
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  button {
    background: #fff;
    border: 1px solid #E6E6E6;
    border-radius: 12px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    padding: 0;

    &:hover {
      background: #F7F7F7;
    }

    svg {
      width: 28px;
      height: 28px;
      color: #333;
    }

    &:first-child {
      svg {
        color: #00ADE6;
      }
      &:hover {
        background: #E6F7FC;
      }
    }

    &:last-child {
      svg {
        color: #666;
      }
      &:hover {
        background: #F7F7F7;
      }
    }
  }
`;
export const FeedbackSuccess = styled.div `
  background: #4CAF50;
  color: white;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;
export const SearchBar = styled.div `
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  padding: 16px;
  background: white;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
`;
export const SearchInput = styled.select `
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 16px;
  appearance: none;
  background-color: white;
  cursor: pointer;
  &::placeholder {
    color: #999;
  }

  & option {
    padding: 16px;
    font-size: 16px;
    font-family: 'HamburgSerial', sans-serif;
    color: #333;
    background-color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }

    &:checked {
      background-color: #00ADE6;
      color: white;
    }
  }
`;
export const StopButton = styled.button `
  background: none;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 8px;
  
  // &:hover {
  //   background: #d32f2f;
  // }
`;
export const SkeletonContainer = styled.div `
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
  margin-top: 12px;
`;
export const SkeletonLine = styled.div `
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
  animation: pulse 1.5s infinite;
  
  &:last-child {
    width: 60%;
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;
export const SuccessSnackbar = styled.div `
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
export const ReloadContainer = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 12px;
  color: #666;
  text-align: center;

  p {
    margin: 0;
    font-size: 14px;
  }

  // svg {
  //   animation: spin 1s linear infinite;
  // }

  // @keyframes spin {
  //   from {
  //     transform: rotate(0deg);
  //   }
  //   to {
  //     transform: rotate(360deg);
  //   }
  // }
`;
