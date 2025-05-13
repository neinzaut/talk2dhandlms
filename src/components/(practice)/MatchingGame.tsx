import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useLanguage } from '../common/LanguageContext';
import { typography } from '../../constants/typography';
import { getSignImages } from '../../utils/imageUtils';

interface MatchingGameProps {
    onComplete: () => void;
}

interface Card {
    id: string;
    type: 'sign' | 'letter';
    value: string;
    image?: any;
    isFlipped: boolean;
    isMatched: boolean;
}

const MatchingGame: React.FC<MatchingGameProps> = ({ onComplete }) => {
    const { selectedLanguage } = useLanguage();
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<Card[]>([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Initialize the game
    useEffect(() => {
        initializeGame();
    }, [selectedLanguage]);

    const initializeGame = () => {
        // Get 6 random letters
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const selectedLetters = Array.from({ length: 6 }, () => {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            return alphabet[randomIndex];
        });

        // Create sign cards
        const signCards: Card[] = selectedLetters.map(letter => ({
            id: `sign-${letter}`,
            type: 'sign',
            value: letter,
            image: getSignImages(selectedLanguage, [letter], 'labelled')[0]?.path,
            isFlipped: false,
            isMatched: false,
        }));

        // Create letter cards
        const letterCards: Card[] = selectedLetters.map(letter => ({
            id: `letter-${letter}`,
            type: 'letter',
            value: letter,
            isFlipped: false,
            isMatched: false,
        }));

        // Combine and shuffle cards
        const allCards = [...signCards, ...letterCards].sort(() => Math.random() - 0.5);
        setCards(allCards);
        setFlippedCards([]);
        setScore(0);
        setMoves(0);
        setIsComplete(false);
    };

    const handleCardPress = (card: Card) => {
        // Don't allow flipping if:
        // 1. Card is already flipped
        // 2. Card is already matched
        // 3. Two cards are already flipped
        if (card.isFlipped || card.isMatched || flippedCards.length >= 2) {
            return;
        }

        // Flip the card
        const updatedCards = cards.map(c => 
            c.id === card.id ? { ...c, isFlipped: true } : c
        );
        setCards(updatedCards);
        setFlippedCards([...flippedCards, card]);

        // If two cards are flipped, check for a match
        if (flippedCards.length === 1) {
            setMoves(prev => prev + 1);
            const firstCard = flippedCards[0];
            
            // Check if the cards match
            if (firstCard.value === card.value && firstCard.type !== card.type) {
                // Match found
                setTimeout(() => {
                    const matchedCards = updatedCards.map(c => 
                        (c.id === firstCard.id || c.id === card.id) ? { ...c, isMatched: true } : c
                    );
                    setCards(matchedCards);
                    setFlippedCards([]);
                    setScore(prev => prev + 1);

                    // Check if game is complete
                    if (score + 1 === 6) {
                        setIsComplete(true);
                        onComplete();
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    const resetCards = updatedCards.map(c => 
                        (c.id === firstCard.id || c.id === card.id) ? { ...c, isFlipped: false } : c
                    );
                    setCards(resetCards);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Matching Game</Text>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>Moves: {moves}</Text>
                    <Text style={styles.statsText}>Matches: {score}/6</Text>
                </View>
            </View>

            {!isComplete ? (
                <ScrollView style={styles.cardsContainer}>
                    <View style={styles.cardsGrid}>
                        {cards.map(card => (
                            <TouchableOpacity
                                key={card.id}
                                style={[
                                    styles.card,
                                    card.isFlipped && styles.cardFlipped,
                                    card.isMatched && styles.cardMatched
                                ]}
                                onPress={() => handleCardPress(card)}
                                disabled={card.isMatched}
                            >
                                {card.isFlipped ? (
                                    card.type === 'sign' ? (
                                        <Image source={card.image} style={styles.signImage} />
                                    ) : (
                                        <Text style={styles.letterText}>{card.value}</Text>
                                    )
                                ) : (
                                    <Text style={styles.cardBack}>?</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>Game Complete! 🎉</Text>
                    <Text style={styles.completionText}>
                        You completed the game in {moves} moves!
                    </Text>
                    <TouchableOpacity
                        style={styles.newGameButton}
                        onPress={initializeGame}
                    >
                        <Text style={styles.newGameButtonText}>Play Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#dee2e6',
    },
    title: {
        ...typography.h1,
        color: '#212529',
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    statsText: {
        ...typography.bodyLarge,
        color: '#495057',
    },
    cardsContainer: {
        flex: 1,
        padding: 20,
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    card: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    cardFlipped: {
        backgroundColor: '#fff',
    },
    cardMatched: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
    },
    cardBack: {
        ...typography.h1,
        color: '#6c757d',
    },
    signImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    letterText: {
        ...typography.h1,
        color: '#212529',
    },
    completionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    completionTitle: {
        ...typography.h1,
        color: '#4CAF50',
        marginBottom: 16,
    },
    completionText: {
        ...typography.bodyLarge,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
    },
    newGameButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
    },
    newGameButtonText: {
        ...typography.button,
        color: '#fff',
    },
});

export default MatchingGame; 