import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { IoArrowBack, IoInformationCircleOutline, IoChevronForward } from 'react-icons/io5';
import { BiMessageAdd } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';
import { Icons } from './assets/image';
import questionsConfig from './config/questions.json';
import GlobalStyles from './styles/globalStyles';
import { Container, Header, Title, IconButton, ChatBubble, AssistantInfo, ProductsContainer, ProductCard, ProductImageContainer, ProductImage, ProductName, ProductUnit, StockInfo, Location, FeedbackContainer, FeedbackQuestion, FeedbackButtons, FeedbackSuccess, SearchBar, StopButton, SkeletonContainer, SkeletonLine, ReloadContainer } from './styles/App.styles';
import CustomSelect from './components/CustomSelect';
const FallbackImage = () => {
    const IconComponent = Icons.ProductImagePlaceholder;
    return _jsx(IconComponent, { style: { width: '100%', height: '100%' } });
};
const ScrollableContainer = ({ children }) => {
    return (_jsx("div", { style: { width: '100%' }, children: children }));
};
const App = () => {
    const [imageLoadError, setImageLoadError] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [hasPositiveFeedback, setHasPositiveFeedback] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [currentInitialQuestionIndex, setCurrentInitialQuestionIndex] = useState(0);
    const containerRef = useRef(null);
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
    const handleImageError = (index) => {
        setImageLoadError(prev => {
            const newErrors = [...prev];
            newErrors[index] = true;
            return newErrors;
        });
    };
    const findAIResponse = (question, selectedOptionText) => {
        const questionConfig = questionsConfig.questions.find(q => q.value === question);
        if (questionConfig?.answers && questionConfig.answers.length > 0) {
            const selectedAnswer = questionConfig.answers.find(answer => answer.option_text === selectedOptionText);
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
    const handlePositiveFeedback = () => {
        // Force state updates to be synchronous
        Promise.resolve().then(() => {
            setHasPositiveFeedback(true);
            setIsReloading(true);
            // Set positive feedback in the last message
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                lastMessage.positive_feedback = true;
                return updatedMessages;
            });
            // Show success snackbar
            setShowSuccessSnackbar(true);
            // Hide feedback buttons
            setShowFeedback(false);
        });
        // Show next question after 2 seconds
        setTimeout(() => {
            handleReload();
        }, 2000);
    };
    // Add useEffect to track state changes
    useEffect(() => {
        console.log('State updated:', { isReloading, hasPositiveFeedback });
    }, [isReloading, hasPositiveFeedback]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOption && !isLoading) {
            setIsLoading(true);
            setTimeout(() => {
                const aiResponse = findAIResponse(currentQuestion, selectedOption);
                const newMessage = {
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
    const handleMouseDown = (e) => {
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
    const handleMouseMove = (e) => {
        if (!isDragging)
            return;
        e.preventDefault();
        const x = e.pageX - (containerRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (containerRef.current) {
            containerRef.current.scrollLeft = scrollLeft - walk;
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(GlobalStyles, {}), _jsxs(Container, { style: { maxWidth: '600px', margin: '0 auto' }, children: [_jsxs(Header, { children: [_jsx(IconButton, { children: _jsx(IoArrowBack, {}) }), _jsx(Title, { children: "Assistent" }), _jsx(IconButton, { children: _jsx(IoInformationCircleOutline, {}) })] }), messages.map((message, index) => (_jsxs(React.Fragment, { children: [_jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', width: '100%' }, children: _jsx(ChatBubble, { isAI: message.isAI, children: message.text }) }), message.isAI && message.map && (_jsx(Location, { children: _jsxs("div", { style: { position: 'relative' }, children: [_jsx("img", { src: message.map, alt: "Location map", style: { maxWidth: '100%', height: 'auto' } }), _jsx("div", { style: {
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
                                            }, children: _jsx(IoChevronForward, { style: { color: '#fff', width: '20px', height: '20px' } }) })] }) })), message.isAI && message.list && message.list.length > 0 && (_jsx(ProductsContainer, { ref: containerRef, onMouseDown: handleMouseDown, onMouseUp: handleMouseUp, onMouseLeave: handleMouseLeave, onMouseMove: handleMouseMove, children: message.list.map((product, productIndex) => (_jsxs(ProductCard, { children: [_jsx(ProductImageContainer, { children: imageLoadError[productIndex] ? (_jsx(FallbackImage, {})) : (_jsx(ProductImage, { src: product.img, alt: product.name, onError: () => handleImageError(productIndex) })) }), _jsx(ProductUnit, { children: product.price }), _jsx("div", { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 'auto' }, children: _jsx(ProductName, { children: product.name }) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }, children: [_jsxs("div", { children: [_jsx(StockInfo, { inStock: product.stock, children: product.stockInfo }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '4px' }, children: [_jsx(Icons.PointMarkerFilled, { style: { width: '16px', height: '16px', color: '#666', display: 'flex', alignItems: 'center' } }), _jsx("span", { style: { color: '#666', fontSize: '14px', lineHeight: '20px' }, children: "AGF" })] })] }), _jsx("div", { style: { background: '#3DB5F2', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(IoChevronForward, { style: { color: '#fff', width: '20px', height: '20px' } }) })] })] }, productIndex))) })), message.isAI && message.followup_text && (_jsxs(_Fragment, { children: [message.isFollowupLoading && (_jsx(_Fragment, { children: _jsxs(SkeletonContainer, { children: [_jsx(SkeletonLine, {}), _jsx(SkeletonLine, {}), _jsx(SkeletonLine, {})] }) })), message.showFollowup && (_jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', width: '100%' }, children: _jsx(ChatBubble, { isAI: false, children: message.followup_text }) }))] }))] }, index))), isLoading && (_jsxs(_Fragment, { children: [_jsxs(AssistantInfo, { children: [_jsx(BsStars, { style: { color: '#00ADE6', fontSize: '1.2em' } }), _jsx("span", { style: { color: '#00ADE6' }, children: "AH assistent" })] }), _jsxs(SkeletonContainer, { children: [_jsx(SkeletonLine, {}), _jsx(SkeletonLine, {}), _jsx(SkeletonLine, {})] })] })), showFeedback && !isReloading && (_jsxs(FeedbackContainer, { children: [_jsx(FeedbackQuestion, { children: "Heeft dit antwoord je geholpen?" }), _jsxs(FeedbackButtons, { children: [_jsx(IconButton, { children: _jsx(Icons.ThumbsUp, { style: { width: '16px', height: '14px', color: '#647887' } }) }), _jsx(IconButton, { children: _jsx(Icons.ThumbsDown, { style: { width: '16px', height: '14px', color: '#647887' } }) })] }), _jsxs(FeedbackSuccess, { children: [_jsx(Icons.Check, {}), _jsx("span", { children: "Bedankt voor je feedback" })] })] })), messages.length > 0 && showFeedback ? (_jsx(ReloadContainer, { children: _jsxs(IconButton, { onClick: handleReload, style: {
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
                            }, children: ["Next question ", _jsx(Icons.RightChevron, { style: { width: 24, height: 24 } })] }) })) : (_jsxs(SearchBar, { as: "form", onSubmit: handleSubmit, children: [_jsx(BiMessageAdd, { size: 24, color: "#666" }), _jsx(CustomSelect, { options: getCurrentQuestionAnswers().map(answer => ({
                                    value: answer.option_text,
                                    label: answer.option_text
                                })), value: selectedOption, onChange: (value) => {
                                    setSelectedOption(value);
                                    if (value) {
                                        setIsLoading(true);
                                        setTimeout(() => {
                                            const aiResponse = findAIResponse(currentQuestion, value);
                                            const newMessage = {
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
                                }, disabled: isLoading }), isLoading && (_jsx(StopButton, { type: "button", onClick: handleStop, children: _jsx(Icons.Stop, { style: { width: '24px', height: '24px', marginRight: '4px' } }) }))] }))] })] }));
};
export default App;
