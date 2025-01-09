import React, { useState, useRef, useEffect, useCallback } from "react";
import { ApolloProvider, useQuery } from "@apollo/client";
import client from "./config/apolloClient";
import { GET_CHARACTERS } from "./config/queries";
import Footer from "./components/Footer";
import "./css/characterTable.css";
import {
  Spinner,
  Table,
  Form,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

function App() {
  const [filters, setFilters] = useState({ status: "", species: "" });
  const [sortBy, setSortBy] = useState("");
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { t, i18n } = useTranslation();
  const observerRef = useRef(null);
  const [speciesSuggestions, setSpeciesSuggestions] = useState([]);
  const [speciesInput, setSpeciesInput] = useState(filters.species || "");

  const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: { page, ...filters },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (page === 1) {
        setCharacters(data.characters.results);
      }
    },
  });

  const loadMore = useCallback(() => {
    if (data?.characters?.info?.next && !isLoadingMore) {
      setIsLoadingMore(true);

      setTimeout(() => {
        fetchMore({
          variables: { page: page + 1, ...filters },
          updateQuery: (prevResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prevResult;
            return {
              characters: {
                ...fetchMoreResult.characters,
                results: [
                  ...(prevResult.characters?.results || []),
                  ...(fetchMoreResult.characters?.results || []),
                ],
              },
            };
          },
        }).then(({ data: fetchData }) => {
          setCharacters((prev) => [
            ...prev,
            ...(fetchData.characters?.results || []),
          ]);
          setPage((prevPage) => prevPage + 1);
          setIsLoadingMore(false);
        });
      }, 1000);
    }
  }, [data?.characters?.info?.next, isLoadingMore, fetchMore, page, filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [loadMore]);

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, status: selectedStatus };
      return updatedFilters;
    });
    setPage(1);
  };

  const handleLanguageSwitch = (lang) => i18n.changeLanguage(lang);

  const handleSpeciesChange = (e) => {
    setSpeciesInput(e.target.value);
    if (e.target.value) {
      const suggestions = ["human", "humanoid", "alien", "robot", "unknown"];
      setSpeciesSuggestions(
        suggestions.filter((species) =>
          species.startsWith(e.target.value.toLowerCase())
        )
      );
    } else {
      setSpeciesSuggestions([]);
    }
  };

  const handleSpeciesSelect = (species) => {
    setSpeciesInput(species);
    setFilters((prevFilters) => ({ ...prevFilters, species }));
    setSpeciesSuggestions([]);
  };

  const handleSpeciesKeyDown = (e) => {
    if (e.key === "Enter") {
      setFilters((prevFilters) => ({ ...prevFilters, species: speciesInput }));
      setSpeciesSuggestions([]);
    }
  };

  const sortedCharacters = [...characters].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "origin") return a.origin.name.localeCompare(b.origin.name);
    return 0;
  });

  const getRowStyle = (status) => {
    switch (status.toLowerCase()) {
      case "alive":
        return { backgroundColor: "#d4edda" };
      case "dead":
        return { backgroundColor: "#f8d7da" };
      default:
        return { backgroundColor: "#edecec" };
    }
  };

  if (loading && page === 1) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger" className="text-center">
          {t("error")}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="d-flex flex-column vh-100 bg-light">
      <header className="p-3 text-black shadow">
        <Container>
          <h1 className="text-center">{t("appTitle")}</h1>
        </Container>
      </header>

      {/* Filters */}
      <Container className="py-3">
        <div className="card p-3 shadow-sm">
          <Row>
            <Col md={4}>
              <Form.Group controlId="statusFilter">
                <Form.Label>{t("status")}</Form.Label>
                <Form.Control
                  as="select"
                  value={filters.status}
                  onChange={handleStatusChange}
                >
                  <option value="">{t("all")}</option>
                  <option value="alive">{t("alive")}</option>
                  <option value="dead">{t("dead")}</option>
                  <option value="unknown">{t("unknown")}</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="speciesFilter">
                <Form.Label>{t("species")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("enterSpecies")}
                  value={speciesInput}
                  onChange={handleSpeciesChange}
                  onKeyDown={handleSpeciesKeyDown}
                />
                {speciesSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {speciesSuggestions.map((species, index) => (
                      <li
                        key={index}
                        onClick={() => handleSpeciesSelect(species)}
                      >
                        {species}
                      </li>
                    ))}
                  </ul>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="sortByFilter">
                <Form.Label>{t("sortBy")}</Form.Label>
                <Form.Control
                  as="select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">{t("none")}</option>
                  <option value="name">{t("name")}</option>
                  <option value="origin">{t("origin")}</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Container>

      <main className="flex-fill overflow-auto">
        <Container>
          <div
            className="table-responsive"
            style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}
          >
            <Table className="table table-bordered">
              <thead
                className="bg-light"
                style={{ position: "sticky", top: 0, zIndex: 2 }}
              >
                <tr>
                  <th style={{ width: "220px" }}>{t("name")}</th>
                  <th style={{ width: "50px" }}>{t("status")}</th>
                  <th style={{ width: "50px" }}>{t("species")}</th>
                  <th style={{ width: "50px" }}>{t("gender")}</th>
                  <th style={{ width: "220px" }}>{t("origin")}</th>
                </tr>
              </thead>
              <tbody>
                {sortedCharacters.map((character, index) => (
                  <tr
                    key={`${character.id}-${index}`}
                    style={getRowStyle(character.status)}
                  >
                    <td>{character.name}</td>
                    <td>{character.status}</td>
                    <td>{character.species}</td>
                    <td>{character.gender}</td>
                    <td>{character.origin.name}</td>
                  </tr>
                ))}
                <tr ref={observerRef}>
                  <td colSpan="5" className="text-center">
                    {isLoadingMore && (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Container>
      </main>

      <Footer
        handleLanguageSwitch={handleLanguageSwitch}
        activeLanguage={i18n.language}
      />
    </Container>
  );
}

function AppWrapper() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

export default AppWrapper;
