import React, { Component } from "react";
import Axios from "axios";
import Card from "./Card";
const API_BASE_URL = "https://deckofcardsapi.com/api/deck/";
// const API = "https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2"

export default class Deck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deck: null,
      drawn: []
    };

    this.getCard = this.getCard.bind(this);
  }

  async componentDidMount() {
    let deck = await Axios.get(`${API_BASE_URL}new/shuffle/?deck_count=1`);
    this.setState({
      deck: deck.data
    });
  }

  async getCard() {
    let id = this.state.deck.deck_id;
    try {
      let cardUrl = ` ${API_BASE_URL}${id}/draw/?count=1`;
      let cardRes = await Axios.get(cardUrl);
      if (!cardRes.data.success) throw new Error("No card remaining!");
      let card = cardRes.data.cards[0];
      console.log(card);
      this.setState(st => ({
        drawn: [
          ...st.drawn,
          {
            id: card.code,
            image: card.image,
            name: `${card.value} of ${card.suit}`
          }
        ]
      }));
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const cards = this.state.drawn.map(c => (
      <Card key={c.id} name={c.name} image={c.image} />
    ));
    return (
      <div>
        <h1>Card Dealer</h1>
        <button onClick={this.getCard}>Get Card!</button>
        {cards}
      </div>
    );
  }
}
