import React, { useState } from "react";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
const QUERY_ALL_USERS = gql`
  query Users {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query Movies {
    movies {
      name
      yearOfPublication
    }
  }
`;

const QUERY_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      username
      age
      nationality
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DELETE_USER_MUTATION($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      id
    }
  }
`;

export default function DisplayData() {
  const [movieSearched, setMovieSearched] = useState("");

  // Create User States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");

  // Delete User State
  const [id, setid] = useState(0);

  const { data, loading, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieSearchedError }] = useLazyQuery(QUERY_MOVIE_BY_NAME);

  //Create User Mutation
  const [createUser] = useMutation(CREATE_USER_MUTATION);

  // Delete USer Mutation
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  if (loading) {
    return <h1>Data is Loading</h1>;
  }
  if (movieSearchedError) {
    console.log(movieSearchedError);
  }

  return (
    <>
      <>
        <input
          type={"text"}
          placeholder={"Name.."}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type={"text"}
          placeholder={"Username.."}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type={"number"}
          placeholder={"Age.."}
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <input
          type={"text"}
          placeholder={"Nationality.."}
          onChange={(event) => {
            setNationality(event.target.value.toUpperCase());
          }}
        />

        <button
          onClick={() => {
            createUser({
              variables: {
                input: { name, username, age: Number(age), nationality },
              },
            });
            refetch();
          }}
        >
          Create User
        </button>
        {""}
      </>

      <>
        {""}

        <input
          type={"number"}
          placeholder={"Delete User by ID"}
          onChange={(event) => {
            setid(event.target.value.toString());
          }}
        />
        <button
          onClick={() => {
            deleteUser({
              variables: {
                deleteUserId: { id },
              },
            });
            refetch();
          }}
        >
          Delete User
        </button>
      </>
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <>
              <h1>Movie</h1>
              <h1>Movie: {movie.name}</h1>
              <h1>Release Date:{movie.yearOfPublication}</h1>
            </>
          );
        })}

      {data &&
        data.users.map((user) => {
          return (
            <>
              <h1>User</h1>
              <h1>Name:{user.name}</h1>
              <h1>Age: {user.age}</h1>
              <h1>Username: {user.username}</h1>
              <h1>Nationality: {user.nationality}</h1>
            </>
          );
        })}
      <>
        <input
          type={"text"}
          placeholder={"put in  movie name"}
          onChange={(event) => {
            setMovieSearched(event.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          Fetch Movie
        </button>
      </>

      <>
        {movieSearchedData && (
          <>
            {""}
            <h1>You Searched For - {movieSearchedData.movie.name}</h1>
            <h1>
              {movieSearchedData.movie.name} was released in {movieSearchedData.movie.yearOfPublication}
            </h1>
          </>
        )}
        {movieSearchedError && (
          <>
            <h1>You may have misspelled your movie try again</h1>
          </>
        )}
      </>
    </>
  );

  //   }

  //   if (loading) {
  //     return <h1>Data is Loading</h1>;
  //   }
  //   if (error) {
  //     console.log(error);
  //   }
  //   if (data) {
  //     console.log(data);
  //   }

  //   return (
  //     <>
  //       {data &&
  //         data.users.map((user) => {
  //           return (
  //             <>
  //               <h1>Name:{user.name}</h1>
  //               <h1>Age: {user.age}</h1>
  //               <h1>Username: {user.username}</h1>
  //               <h1>Nationality: {user.nationality}</h1>
  //             </>
  //           );
  //         })}
  //     </>
  //   );
  // }
}
