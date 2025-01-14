import { createSlice } from "@reduxjs/toolkit";
import {
  createConversation,
  deleteConversation,
  fetchConversation,
  regenerateMessage,
  sendMessage,
  updateMessageThunk,
} from "@/store/api/conversation";

import { fetchDID } from "@/store/api/did";
import { fetchIndex } from "@/store/api/index";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    data: null as any,
    loading: false,
    error: null as any,
    regenerationLoading: false,
    messageLoading: false,
  },
  reducers: {
    setMessages(state, action) {
      state.data.messages = action.payload;
    },
    setMessageLoading: (state, action) => {
      state.messageLoading = action.payload;
    },
    addMessage(state, action) {
      if (state.data?.messages) {
        state.data.messages.push(action.payload);
      } else {
        state.data = {
          ...state.data,
          messages: [action.payload],
        };
      }
    },
    updateMessage(state, action) {
      const index = state.data.messages.findIndex(
        (msg: any) => msg.id === action.payload.id,
      );
      if (index !== -1) {
        state.data.messages[index] = action.payload;
      } else {
        state.data.messages.push(action.payload);
      }
    },
    deleteMessage(state, action) {
      state.data.messages = state.data.messages.filter(
        (msg: any) => msg.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(fetchDID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDID.fulfilled, (state, action) => {
        state.loading = false;
        state.data = null;
      })
      .addCase(fetchDID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(fetchIndex.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIndex.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
      })
      .addCase(fetchIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(regenerateMessage.pending, (state) => {
        state.regenerationLoading = true;
      })
      .addCase(regenerateMessage.fulfilled, (state, action) => {
        state.regenerationLoading = false;
        if (action.payload.messagesBeforeGenerate) {
          state.data.messages = action.payload.messagesBeforeGenerate;
        }
      })
      .addCase(regenerateMessage.rejected, (state, action) => {
        state.regenerationLoading = false;
        state.error = action.payload;
      })
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = null;
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data.messages) {
          state.data.messages.push(action.payload.message);
          return;
        }
        const { message, prevID } = action.payload;

        if (state.data && !state.data.messages) {
          state.data.messages = [message];
          return;
        }

        const messageIndex = state.data.messages.findIndex(
          (msg: any) => msg.id === prevID,
        );

        if (messageIndex !== -1) {
          state.data.messages[messageIndex] = message;
        } else {
          state.data.messages.push(message);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMessageThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        let messages = [];
        if (action.payload.messagesBeforeEdit) {
          messages = action.payload.messagesBeforeEdit;
        }
        if (action.payload.editMessage) {
          messages.push(action.payload.editMessage);
        }
        state.data.messages = messages;
      })
      .addCase(updateMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setMessages,
  addMessage,
  deleteMessage,
  updateMessage,
  setMessageLoading,
} = conversationSlice.actions;
export const selectConversation = (state: any) => state.conversation;
export default conversationSlice.reducer;
