import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { ReactComponent as Floor2Icon } from './assets/images/floors/floor2.svg';
import { IoArrowBack, IoInformationCircleOutline, IoChevronForward } from 'react-icons/io5';
import { BiMessageAdd } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';
import { Icons } from './assets/image';
import { FloorMaps } from './assets/image';
import questionsConfig from './config/questions.json';
import GlobalStyles from './styles/globalStyles';
import floor2Image from './assets/images/floors/floor2.svg';
import {
  Container,
  Header,
  Title,
  IconButton,
  ChatBubble,
  AssistantInfo,
  ProductsContainer,
  ProductCard,
  ProductImageContainer,
  ProductImage,
  ProductName,
  ProductUnit,
  StockInfo,
  Location,
  FeedbackContainer,
  FeedbackQuestion,
  FeedbackButtons,
  FeedbackSuccess,
  SearchBar,
  StopButton,
  SkeletonContainer,
  SkeletonLine,
  ReloadContainer
} from './styles/App.styles';
import CustomSelect from './components/CustomSelect';

interface Product {
  name: string;
  price: string;
  img: string;
  stockInfo: string;
  stock: boolean;
}

interface Answer {
  option_text: string;
  correct: boolean;
  AI_full_response_text: string;
  followup_text: string;
  map?: string;
  list?: Product[];
}

interface Message {
  text: string;
  isAI: boolean;
  map?: string;
  list?: Product[];
  followup_text?: string;
  showFollowup?: boolean;
  isFollowupLoading?: boolean;
  positive_feedback?: boolean;
}

const FallbackImage: React.FC = () => {
  const IconComponent = Icons.ProductImagePlaceholder;
  return <IconComponent style={{ width: '100%', height: '100%' }} />;
};

// const ScrollableContainer: React.FC<{ children: React.ReactNode }> = ({ children }): React.ReactElement => {
//   return (
//     <div style={{ width: '100%' }}>
//       {children}
//     </div>
//   );
// };

const App: React.FC = () => {
  const [imageLoadError, setImageLoadError] = useState<boolean[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [hasPositiveFeedback, setHasPositiveFeedback] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentInitialQuestionIndex, setCurrentInitialQuestionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialQuestions = questionsConfig.questions.filter(q => q.initial === true);
    if (initialQuestions.length > 0) {
      const nextIndex = currentInitialQuestionIndex % initialQuestions.length;
      const initialQuestion = initialQuestions[nextIndex].value;
      setMessages([{ text: initialQuestion, isAI: false }]);
      setCurrentQuestion(initialQuestion);
      setCurrentInitialQuestionIndex(nextIndex + 1);
    }
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isAI) {
      setCurrentQuestion(lastMessage.text);
    }
  }, [messages]);

  useEffect(() => {
    // Convert floor2.png to data URL when component mounts
    const img = new Image();
    img.src = floor2Image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/svg');
        // Update all messages that use floor2.png to use the data URL instead
        setMessages(prevMessages => 
          prevMessages.map(msg => ({
            ...msg,
            map: msg.map === 'src/assets/images/floors/floor2.svg' ? dataUrl : msg.map
          }))
        );
      }
    };
  }, []);

  const handleImageError = (index: number) => {
    setImageLoadError(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const findAIResponse = (question: string, selectedOptionText: string) => {
    const questionConfig = questionsConfig.questions.find(q => q.value === question);
    if (questionConfig?.answers && questionConfig.answers.length > 0) {
      const selectedAnswer = questionConfig.answers.find(answer => answer.option_text === selectedOptionText) as Answer;
      if (selectedAnswer) {
        return {
          text: selectedAnswer.AI_full_response_text,
          map: selectedAnswer.map,
          list: selectedAnswer.list,
          followup_text: selectedAnswer.followup_text
        };
      }
    }
    return {
      text: "I'm sorry, I couldn't find a specific answer to that question."
    };
  };

  // const handlePositiveFeedback = () => {
  //   // Force state updates to be synchronous
  //   Promise.resolve().then(() => {
  //     setHasPositiveFeedback(true);
  //     setIsReloading(true);
      
  //     // Set positive feedback in the last message
  //     setMessages(prevMessages => {
  //       const updatedMessages = [...prevMessages];
  //       const lastMessage = updatedMessages[updatedMessages.length - 1];
  //       lastMessage.positive_feedback = true;
  //       return updatedMessages;
  //     });

  //     // Show success snackbar
  //     // Show success snackbar
  //     // setShowSuccessSnackbar(true);
  //     // Hide feedback buttons
  //     setShowFeedback(false);
  //   });
    
  //   // Show next question after 2 seconds
  //   setTimeout(() => {
  //     handleReload();
  //   }, 2000);
  // };

  // Add useEffect to track state changes
  useEffect(() => {
    console.log('State updated:', { isReloading, hasPositiveFeedback });
  }, [isReloading, hasPositiveFeedback]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedOption && !isLoading) {
      setIsLoading(true);
      
      setTimeout(() => {
        const aiResponse = findAIResponse(currentQuestion, selectedOption);
        const newMessage: Message = { 
          text: aiResponse.text, 
          isAI: true,
          map: aiResponse.map,
          list: aiResponse.list,
          followup_text: aiResponse.followup_text,
          isFollowupLoading: false,
          showFollowup: false
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setIsLoading(false);
        setSelectedOption('');

        if (aiResponse.followup_text) {
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            lastMessage.isFollowupLoading = true;
            return updatedMessages;
          });

          setTimeout(() => {
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              lastMessage.isFollowupLoading = false;
              lastMessage.showFollowup = true;
              return updatedMessages;
            });
          }, 2000);
        }

        // Check if the selected answer is correct
        const questionConfig = questionsConfig.questions.find(q => q.value === currentQuestion);
        const selectedAnswer = questionConfig?.answers.find(answer => answer.option_text === selectedOption);
        
        if (selectedAnswer?.correct) {
          // Show feedback buttons after 2 seconds
          setTimeout(() => {
            setShowFeedback(true);
          }, 2000);
        }
      }, 500);
    }
  };

  const handleStop = () => {
    setIsLoading(false);
    setSelectedOption('');
  };

  const getCurrentQuestionAnswers = () => {
    const questionConfig = questionsConfig.questions.find(q => q.value === currentQuestion);
    return questionConfig?.answers || [];
  };

  const handleReload = () => {
    const initialQuestions = questionsConfig.questions.filter(q => q.initial === true);
    if (initialQuestions.length > 0) {
      const nextIndex = currentInitialQuestionIndex % initialQuestions.length;
      const initialQuestion = initialQuestions[nextIndex].value;
      setMessages([{ text: initialQuestion, isAI: false }]);
      setCurrentQuestion(initialQuestion);
      setCurrentInitialQuestionIndex(nextIndex + 1);
      setShowFeedback(false);
      setIsReloading(false);
      setHasPositiveFeedback(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <>
      <GlobalStyles />
      <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Header>
          <IconButton>
            <IoArrowBack />
          </IconButton>
          <Title>Assistent</Title>
          <IconButton>
            <IoInformationCircleOutline />
          </IconButton>
        </Header>

        {messages.map((message, index) => (
          <React.Fragment key={index}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <ChatBubble isAI={message.isAI}>
              {message.text}
            </ChatBubble>
            </div>
            {message.isAI && message.map && (
              <Location>
    <div style={{ position: 'relative' }}>
      {message.map === 'src/assets/images/floors/floor2.svg' ? (
        <Floor2Icon style={{ maxWidth: '100%', height: 'auto' }} />
      ) : message.map.startsWith('@') ? (
        (() => {
          const SVGComponent = FloorMaps[message.map.slice(1) as keyof typeof FloorMaps];
          return <SVGComponent style={{ maxWidth: '100%', height: 'auto' }} />;
        })()
      ) : (
        <img 
          src={message.map} 
          alt="Location map" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
      )}
      <div style={{ 
        position: 'absolute', 
        bottom: '12px', 
        right: '12px',
        background: '#3DB5F2', 
        borderRadius: '50%', 
        width: '36px', 
        height: '36px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <IoChevronForward style={{ color: '#fff', width: '20px', height: '20px' }} />
      </div>
    </div>
  </Location>
            )}
            
            {message.isAI && message.list && message.list.length > 0 && (
              <ProductsContainer
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                {message.list.map((product, productIndex) => (
                  <ProductCard key={productIndex}>
                    <ProductImageContainer>
                      {imageLoadError[productIndex] ? (
                        <FallbackImage />
                      ) : (
                        <ProductImage
                          src={product.img}
                          alt={product.name}
                          onError={() => handleImageError(productIndex)}
                        />
                      )}
                    </ProductImageContainer>
                    <ProductUnit>{product.price}</ProductUnit>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <ProductName>{product.name}</ProductName>
                      </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }}>
                      <div><StockInfo inStock={product.stock}>{product.stockInfo}</StockInfo>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Icons.PointMarkerFilled style={{ width: '16px', height: '16px', color: '#666', display: 'flex', alignItems: 'center' }} />
                          <span style={{ color: '#666', fontSize: '14px', lineHeight: '20px' }}>AGF</span>
                      </div>
                      </div>
                      <div style={{ background: '#3DB5F2', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IoChevronForward style={{ color: '#fff', width: '20px', height: '20px' }} />
                      </div>
                    </div>
                  </ProductCard>
                ))}
              </ProductsContainer>
            )}
            {message.isAI && message.followup_text && (
              <>
                {message.isFollowupLoading && (
                  <>
                    <SkeletonContainer>
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                    </SkeletonContainer>
                  </>
                )}
                {message.showFollowup && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <ChatBubble isAI={false}>
                      {message.followup_text}
                    </ChatBubble>
                  </div>
                )}
              </>
            )}
          </React.Fragment>
        ))}

        {isLoading && (
          <>
            <AssistantInfo>
              <BsStars style={{ color: '#00ADE6', fontSize: '1.2em' }} />
              <span style={{ color: '#00ADE6'}}>AH assistent</span>
            </AssistantInfo>
            <SkeletonContainer>
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine />
            </SkeletonContainer>
          </>
        )}

        {showFeedback && !isReloading && (
          <FeedbackContainer>
            <FeedbackQuestion>Heeft dit antwoord je geholpen?</FeedbackQuestion>
            <FeedbackButtons>
              <IconButton>
                <Icons.ThumbsUp style={{ width: '16px', height: '14px', color: '#647887' }} />
              </IconButton>
              <IconButton>
                <Icons.ThumbsDown style={{ width: '16px', height: '14px', color: '#647887' }} />
              </IconButton>
            </FeedbackButtons>
            <FeedbackSuccess>
              <Icons.Check />
              <span>Bedankt voor je feedback</span>
            </FeedbackSuccess>
          </FeedbackContainer>
        )}

        {messages.length > 0 && showFeedback ? (
          <ReloadContainer>
            <IconButton onClick={handleReload} style={{
              width: '100%', 
              background: '#00ADE6', 
              borderRadius: '8px',
              padding: '10px', 
              color: '#fff', 
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
              }}>
            Next question <Icons.RightChevron style={{ width: 24, height: 24 }} />
            </IconButton>
          </ReloadContainer>
        ) : (
          <SearchBar as="form" onSubmit={handleSubmit}>
            <BiMessageAdd size={24} color="#666" />
            <CustomSelect
              options={getCurrentQuestionAnswers().map(answer => ({
                value: answer.option_text,
                label: answer.option_text
              }))}
              value={selectedOption}
              onChange={(value) => {
                setSelectedOption(value);
                if (value) {
                  setIsLoading(true);
                  setTimeout(() => {
                    const aiResponse = findAIResponse(currentQuestion, value);
                    const newMessage: Message = {
                      text: aiResponse.text,
                      isAI: true,
                      map: aiResponse.map,
                      list: aiResponse.list,
                      followup_text: aiResponse.followup_text,
                      isFollowupLoading: false,
                      showFollowup: false
                    };

                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    setIsLoading(false);
                    setSelectedOption('');

                    if (aiResponse.followup_text) {
                      setMessages(prevMessages => {
                        const updatedMessages = [...prevMessages];
                        const lastMessage = updatedMessages[updatedMessages.length - 1];
                        lastMessage.isFollowupLoading = true;
                        return updatedMessages;
                      });

                      setTimeout(() => {
                        setMessages(prevMessages => {
                          const updatedMessages = [...prevMessages];
                          const lastMessage = updatedMessages[updatedMessages.length - 1];
                          lastMessage.isFollowupLoading = false;
                          lastMessage.showFollowup = true;
                          return updatedMessages;
                        });
                      }, 2000);
                    }

                    // Check if the selected answer is correct
                    const questionConfig = questionsConfig.questions.find(q => q.value === currentQuestion);
                    const selectedAnswer = questionConfig?.answers.find(answer => answer.option_text === value);
                    
                    if (selectedAnswer?.correct) {
                      // Show feedback buttons after 2 seconds
                      setTimeout(() => {
                        setShowFeedback(true);
                      }, 2000);
                    }
                  }, 1000);
                }
              }}
              disabled={isLoading}
            />
            {isLoading && (
              <StopButton type="button" onClick={handleStop}>
                <Icons.Stop style={{ width: '24px', height: '24px', marginRight: '4px' }} />
              </StopButton>
            )}
          </SearchBar>
        )}
      </Container>
    </>
  );
};

export default App;