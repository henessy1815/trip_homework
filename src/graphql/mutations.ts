import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      _id
      email
      name
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
    }
  }
`;

export const LIKE_BOARD = gql`
  mutation likeBoard($boardId: ID!) {
    likeBoard(boardId: $boardId)
  }
`;

export const DISLIKE_BOARD = gql`
  mutation dislikeBoard($boardId: ID!) {
    dislikeBoard(boardId: $boardId)
  }
`;

export const CREATE_BOARD_COMMENT = gql`
  mutation createBoardComment($boardId: ID!, $input: CreateBoardCommentInput!) {
    createBoardComment(boardId: $boardId, createBoardCommentInput: $input) {
      _id
    }
  }
`;

export const DELETE_BOARD_COMMENT = gql`
  mutation deleteBoardComment($boardCommentId: ID!, $password: String) {
    deleteBoardComment(boardCommentId: $boardCommentId, password: $password)
  }
`;

export const UPDATE_BOARD_COMMENT = gql`
  mutation updateBoardComment(
    $boardCommentId: ID!
    $password: String
    $input: UpdateBoardCommentInput!
  ) {
    updateBoardComment(
      boardCommentId: $boardCommentId
      password: $password
      updateBoardCommentInput: $input
    ) {
      _id
    }
  }
`;

export const CREATE_TRAVELPRODUCT_QUESTION = gql`
  mutation createTravelproductQuestion(
    $travelproductId: ID!
    $contents: String!
  ) {
    createTravelproductQuestion(
      travelproductId: $travelproductId
      createTravelproductQuestionInput: { contents: $contents }
    ) {
      _id
    }
  }
`;

export const CREATE_TRAVELPRODUCT_QUESTION_ANSWER = gql`
  mutation createTravelproductQuestionAnswer(
    $questionId: ID!
    $contents: String!
  ) {
    createTravelproductQuestionAnswer(
      travelproductQuestionId: $questionId
      createTravelproductQuestionAnswerInput: { contents: $contents }
    ) {
      _id
    }
  }
`;

export const UPDATE_TRAVELPRODUCT_QUESTION_ANSWER = gql`
  mutation updateTravelproductQuestionAnswer(
    $answerId: ID!
    $contents: String!
  ) {
    updateTravelproductQuestionAnswer(
      travelproductQuestionAnswerId: $answerId
      updateTravelproductQuestionAnswerInput: { contents: $contents }
    ) {
      _id
    }
  }
`;

export const DELETE_TRAVELPRODUCT_QUESTION_ANSWER = gql`
  mutation deleteTravelproductQuestionAnswer($answerId: ID!) {
    deleteTravelproductQuestionAnswer(travelproductQuestionAnswerId: $answerId)
  }
`;
