(function() {
    var data;
  
    data = {
      min_players: 2,
      max_players: 4,
      num_cards_displayed: 15,
      cards: [
        {
          name: 'Guard',
          count: 5,
          quick_instructions: 'Guess a player\'s hand',
          instructions: 'Choose another player and name a non-Guard card. If that player has that card, they are out of the round.',
          image: '1-guard.svg',
          action_phase: 'guard_action'
        }, {
          name: 'Priest',
          count: 2,
          quick_instructions: 'Look at a player\'s hand',
          instructions: 'Look at another player\'s hand.',
          image: '2-priest.svg',
          action_phase: 'priest_action'
        }, {
          name: 'Baron',
          count: 2,
          quick_instructions: 'Compare hands; lower hand is out',
          instructions: 'You and another player secretly compare hands. The player with the lower value is out of the round.',
          image: '3-baron.svg',
          action_phase: 'baron_action'
        }, {
          name: 'Handmaid',
          count: 2,
          quick_instructions: 'Protection until your next turn',
          instructions: 'Until your next turn, ignore all effects from other players\' cards.',
          image: '4-handmaid.svg',
          action_phase: 'handmaid_action'
        }, {
          name: 'Prince',
          count: 2,
          quick_instructions: 'One player discards their hand',
          instructions: 'Choose any player (including yourself) to discard their hand and draw a new card.',
          image: '5-prince.svg',
          action_phase: 'prince_action'
        }, {
          name: 'King',
          count: 1,
          quick_instructions: 'Trade Hands',
          instructions: 'Trade hands with another player of your choice.',
          image: '6-king.svg',
          action_phase: 'king_action'
        }, {
          name: 'Countess',
          count: 1,
          quick_instructions: 'Discard if caught with King or Prince',
          instructions: 'If you have this card and the King or Prince in your hand, you must discard this card.',
          image: '7-countess.svg',
          action_phase: 'countess_action'
        }, {
          name: 'Princess',
          count: 1,
          quick_instructions: 'Lose if discarded',
          instructions: 'If you discard this card, you are out of the round.',
          image: '8-princess.svg',
          action_phase: 'princess_action'
        }
      ],
      token_win_num: {
        2: 7,
        3: 5,
        4: 4
      },
      token_win_num_extended: 3
    };
  
    if (typeof window !== "undefined" && window !== null) {
      window.netgames.data = data;
    }
  
    if (typeof module !== "undefined" && module !== null) {
      module.exports.data = data;
    }
  
  }).call(this);