import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
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
    const [showPreview, setShowPreview] = useState(true);
    const [previewCards, setPreviewCards] = useState<Card[]>([]);
    const previewOpacity = useRef(new Animated.Value(1)).current;

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
            isFlipped: true, // Face up for preview
            isMatched: false,
        }));

        // Create letter cards
        const letterCards: Card[] = selectedLetters.map(letter => ({
            id: `letter-${letter}`,
            type: 'letter',
            value: letter,
            isFlipped: true, // Face up for preview
            isMatched: false,
        }));

        // For preview, show all cards in correct pairs
        const previewPairs: Card[] = [];
        for (let i = 0; i < signCards.length; i++) {
            previewPairs.push(signCards[i], letterCards[i]);
        }
        setPreviewCards(previewPairs);
        setShowPreview(true);
        setIsComplete(false);
        setScore(0);
        setMoves(0);
        setFlippedCards([]);

        // After 2 seconds, fade out preview, then shuffle and start the game
        setTimeout(() => {
            Animated.timing(previewOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                const allCards = [...signCards, ...letterCards].map(card => ({ ...card, isFlipped: false }));
                const shuffled = allCards.sort(() => Math.random() - 0.5);
                setCards(shuffled);
                setShowPreview(false);
                previewOpacity.setValue(1); // Reset for next game
            });
        }, 2000);
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

    // For rendering, use previewCards if showPreview, else use cards
    const signCards = (showPreview ? previewCards : cards).filter(card => card.type === 'sign');
    const letterCards = (showPreview ? previewCards : cards).filter(card => card.type === 'letter');
    const pairs = signCards.map((signCard, idx) => [signCard, letterCards[idx]]);

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
                <View style={styles.cardsContainer}>
                    <Animated.View style={[styles.pairedRowsWrapper, showPreview && { opacity: previewOpacity }]}> 
                        {pairs.map(([signCard, letterCard], idx) => (
                            <View key={idx} style={styles.pairRow}>
                                {/* Sign card (left) */}
                                <TouchableOpacity
                                    style={[
                                        styles.card,
                                        signCard.isFlipped && styles.cardFlipped,
                                        signCard.isMatched && styles.cardMatched
                                    ]}
                                    onPress={() => !showPreview && handleCardPress(signCard)}
                                    disabled={signCard.isMatched || showPreview}
                                >
                                    {signCard.isFlipped ? (
                                        <Image source={signCard.image} style={styles.signImage} />
                                    ) : (
                                        <Text style={styles.cardBack}>?</Text>
                                    )}
                                </TouchableOpacity>
                                {/* Divider */}
                                <View style={styles.divider} />
                                {/* Letter card (right) */}
                                <TouchableOpacity
                                    style={[
                                        styles.card,
                                        letterCard.isFlipped && styles.cardFlipped,
                                        letterCard.isMatched && styles.cardMatched
                                    ]}
                                    onPress={() => !showPreview && handleCardPress(letterCard)}
                                    disabled={letterCard.isMatched || showPreview}
                                >
                                    {letterCard.isFlipped ? (
                                        <Text style={styles.letterText}>{letterCard.value}</Text>
                                    ) : (
                                        <Text style={styles.cardBack}>?</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ))}
                    </Animated.View>
                </View>
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
    pairedRowsWrapper: {
        marginTop: 32,
        gap: 16,
    },
    pairRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    divider: {
        width: 2,
        height: 40,
        backgroundColor: '#D9D9D9',
        marginHorizontal: 12,
        borderRadius: 1,
    },
    card: {
        width: 60,
        height: 60,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dee2e6',
        marginBottom: 12,
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
        width: 40,
        height: 40,
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