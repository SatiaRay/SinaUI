import styled from "styled-components";

export const H2 = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;

  .dark & {
    color: #f9fafb;
  }
`;

// Chat Container Components
export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  padding-top: 2.25rem;
  padding-bottom: 1.75rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  height: 100%;
  width: 100%;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
`;

export const InitialLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 2rem;
  transition: all 0.5s ease;
`;

export const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const WelcomeText = styled.p`
  color: #666;

  .dark & {
    color: #d1d5db;
  }
`;

export const InputContainer = styled.div`
  width: 100%;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  max-height: 200vh;
  min-height: 3rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #f9fafb;
  gap: 0.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;

  .dark & {
    background-color: #111827;
  }
`;

export const SendButton = styled.button`
  padding: 0.5rem;
  margin-bottom: 7px;
  color: ${props => props.disabled ? '#9ca3af' : '#2563eb'};
  border-radius: 0.5rem;
  font-weight: 500;
  transition: colors 0.2s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: transparent;
  border: none;

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    background: transparent;
  }
`;

export const VoiceButtonContainer = styled.div`
  max-width: 15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 9px;
  ${props => props.hidden && 'display: none;'}
`;

export const WizardContainer = styled.div`
  margin-top: 1.5rem;
`;

export const ChatMessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  gap: 1rem;
  transition: all 0.5s ease;
  height: calc(100vh - 200px);

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  border-radius: 50%;
  height: 1.25rem;
  width: 1.25rem;
  border-bottom: 2px solid #3b82f6;
  margin-right: 0.75rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  color: #6b7280;

  .dark & {
    color: #d1d5db;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  color: #6b7280;
  padding: 1rem;

  .dark & {
    color: #9ca3af;
  }
`;

export const MessageContainer = styled.div`
  margin-bottom: 1rem;
  transition: height 0.3s ease-in-out;
  display: grid;
`;

export const LoadingBotResponse = styled.div`
  color: white;
  display: grid;
  justify-content: end;
  text-align: end;
`;

export const LoadingBotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0.25rem;
  gap: 0.25rem;
  text-align: end;
`;

export const LoadingCaption = styled.small`
  color: #9ca3af;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  font-style: italic;

  .dark & {
    color: #6b7280;
  }
`;

export const BotIconContainer = styled.span`
  padding: 0.375rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  .dark & {
    background-color: #202936;
  }

  svg {
    width: 1rem;
    margin-bottom: 0.25rem;
    color: #374151;

    .dark & {
      color: #d1d5db;
    }
  }
`;

export const ChatEndRef = styled.div``;

export const NormalLayoutInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-height: 200vh;
  min-height: 3rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #f9fafb;
  gap: 0.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.5s ease;

  .dark & {
    background-color: #111827;
  }

  /* Style the TextInputWithBreaks component to take remaining space */
  > div:nth-child(2) {
    flex: 1;
  }
`;

export const NormalLayoutSendButton = styled.button`
  padding: 0.5rem;
  color: ${props => props.disabled ? '#9ca3af' : '#2563eb'};
  border-radius: 0.5rem;
  font-weight: 500;
  transition: colors 0.2s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: transparent;
  border: none;

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    background: transparent;
  }
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${props => props.hidden && 'display: none;'}
`;

export const ClearHistoryButton = styled.button`
  padding: 0.5rem;
  color: #2563eb;
  border-radius: 0.5rem;
  transition: colors 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #dbeafe;
  }

  .dark &:hover {
    background-color: #374151;
  }

  svg {
    height: 1.25rem;
    width: 1.25rem;
  }
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  margin-top: 0.5rem;
  text-align: right;
`;

// Message Components
export const SentMessageContainer = styled.div`
  background-color: rgba(219, 234, 254, 0.7);
  margin-left: 4rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: right;
  max-width: 48rem;
  min-width: 10rem;
  display: inline-block;
  justify-self: start;

  @media (max-width: 768px) {
    margin-left: 0;
  }

  .dark & {
    background-color: rgba(30, 58, 138, 0.2);
  }
`;

export const SentMessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

export const SentMessageTimestamp = styled.span`
  font-size: 0.75rem;
  color: #6b7280;

  .dark & {
    color: #9ca3af;
  }
`;

export const SentMessageLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #2563eb;

  .dark & {
    color: #60a5fa;
  }
`;

export const ReceivedMessageContainer = styled.div`
  background-color: #f9fafb;
  line-height: 2;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  text-wrap: wrap;
  text-align: justify;
  margin-left: 0.25rem;
  margin-right: 2rem;
  border-radius: 0.5rem;
  min-width: 10rem;
  width: 100%;
  max-width: 100%;
  justify-self: end;

  @media (max-width: 768px) {
    margin-right: 0;
  }

  .dark & {
    background-color: #111827;
  }
`;

export const TextMessageContent = styled.pre`
  color: #1f2937;
  display: flex;
  text-wrap: wrap;
  flex-wrap: wrap;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  unicode-bidi: plaintext;
  direction: rtl;

  .dark & {
    color: white;
  }

  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  th {
    background-color: white;
    color: black;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    text-align: right;

    .dark & {
      background-color: white;
      color: black;
      border-color: #374151;
    }
  }

  td {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    text-align: right;

    .dark & {
      color: white;
      border-color: #374151;
    }
  }

  /* Link styling */
  a {
    color: #2563eb;
    text-decoration: underline;
    word-break: break-all;

    &:hover {
      color: #1d4ed8;
    }

    .dark & {
      color: #60a5fa;

      &:hover {
        color: #93c5fd;
      }
    }
  }
`;

export const CopyButton = styled.button`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${props => props.copied ? '#3dc909' : '#444'};

  &:hover {
    background-color: #f3f4f6;
  }

  .dark &:hover {
    background-color: #374151;
  }

  svg {
    width: 1rem;
    height: 1rem;

    .dark & {
      color: #f3f4f6;
    }
  }
`;

export const ImageMessageContainer = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border-radius: 0.5rem;
  text-align: right;
  background-color: #f3f4f6;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  max-width: 100%;

  @media (min-width: 768px) {
    max-width: 450px;
  }

  .dark & {
    background-color: #1f2937;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  width: 181px;
  height: 181px;

  @media (min-width: 768px) {
    width: 211px;
    height: 211px;
  }
`;

export const ImagePlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background-color: #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;

  .dark & {
    background-color: #4b5563;
  }
`;

export const ImageSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 4px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  .dark & {
    border-color: #1f2937;
    border-top-color: transparent;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => props.loaded ? 'block' : 'none'};
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
`;

export const ImageOverlayText = styled.span`
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
`;

export const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

export const FlexGapWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
`;

// Upload Components
export const UploadErrorMessage = styled.div`
  margin-top: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #fca5a5;
  background-color: #fef2f2;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #991b1b;
`;

export const UploadButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const UploadButton = styled.button`
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.5rem;
  color: white;
  border: none;
  cursor: pointer;
  background-color: ${props => {
    if (props.disabled) return '#9ca3af';
    if (props.variant === 'cancel') return '#d97706';
    return '#2563eb';
  }};

  &:hover {
    background-color: ${props => {
      if (props.disabled) return '#9ca3af';
      if (props.variant === 'cancel') return '#b45309';
      return '#1d4ed8';
    }};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;


export const WizardButtonStyled = styled.button`
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  background-color: #dbeafe; /* bg-blue-100 */
  color: #1e40af; /* text-blue-800 */
  border-radius: 0.5rem; /* rounded-lg */
  transition: background-color 0.2s ease-in-out;
  box-sizing: border-box;

  &:hover {
    background-color: #bfdbfe; /* hover:bg-blue-200 */
  }

  /* Dark mode styles (triggered by .dark parent) */
  .dark & {
    background-color: #1e3a8a; /* dark:bg-blue-900 */
    color: #93c5fd; /* dark:text-blue-300 */

    &:hover {
      background-color: #1e40af; /* dark:hover:bg-blue-800 */
    }
  }
`;



export const VoiceButtonStyled = styled.button`
  display: flex; /* flex */
  align-items: center; /* items-center */
  justify-content: center; /* justify-center */

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loader spacing */
  .loader {
    margin-bottom: 0.25rem; /* mb-1 */
    margin-left: 0.125rem;  /* ml-0.5 */
  }

  /* Icon */
  svg {
    width: 1.5rem;  /* w-6 */
    height: 1.5rem; /* h-6 */
    color: #2563eb; /* text-blue-600 */
  }

  /* ✅ Dark mode */
  .dark & svg {
    color: #3b82f6; /* dark:text-blue-400 */
  }
`;