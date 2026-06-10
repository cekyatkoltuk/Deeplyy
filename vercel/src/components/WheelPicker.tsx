import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Colors, FontSizes, FontFamily, FontWeights } from '../utils/theme';

export interface PickerItem {
    label: string | number;
    value: string | number;
}

interface WheelPickerProps {
    items: PickerItem[];
    selectedValue: string | number;
    onValueChange: (value: string | number) => void;
    itemHeight?: number;
    visibleItems?: number;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
    items,
    selectedValue,
    onValueChange,
    itemHeight = 50,
    visibleItems = 3,
}) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(
        Math.max(0, items.findIndex(item => item.value === selectedValue))
    );

    const containerHeight = itemHeight * visibleItems;
    const paddingVertical = (containerHeight - itemHeight) / 2;

    useEffect(() => {
        const index = items.findIndex(item => item.value === selectedValue);
        if (index !== -1 && index !== activeIndex) {
            setActiveIndex(index);
            scrollViewRef.current?.scrollTo({ y: index * itemHeight, animated: true });
        }
    }, [selectedValue, items, itemHeight]);

    // Initial scroll on mount to ensure the visual position matches the state
    useEffect(() => {
        const index = items.findIndex(item => item.value === selectedValue);
        if (index > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: index * itemHeight, animated: false });
            }, 50);
        }
    }, []);

    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        let index = Math.round(offsetY / itemHeight);
        
        // Clamp index
        index = Math.max(0, Math.min(index, items.length - 1));

        if (index !== activeIndex) {
            setActiveIndex(index);
        }

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        
        scrollTimeout.current = setTimeout(() => {
            if (items[index]) {
                onValueChange(items[index].value);
            }
            scrollViewRef.current?.scrollTo({ y: index * itemHeight, animated: true });
        }, 150);
    };

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // Just in case, also trigger on Momentum end or Drag end
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        const offsetY = event.nativeEvent.contentOffset.y;
        let index = Math.round(offsetY / itemHeight);
        index = Math.max(0, Math.min(index, items.length - 1));
        
        if (items[index]) {
            onValueChange(items[index].value);
        }
        scrollViewRef.current?.scrollTo({ y: index * itemHeight, animated: true });
    };

    return (
        <View style={[styles.container, { height: containerHeight }]}>
            {/* Selection overlay */}
            <View
                style={[
                    styles.selectionOverlay,
                    { height: itemHeight, top: paddingVertical }
                ]}
                pointerEvents="none"
            />
            
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                onScroll={handleScroll}
                onScrollEndDrag={handleScrollEnd}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingTop: paddingVertical,
                    paddingBottom: paddingVertical,
                }}
            >
                {items.map((item, index) => {
                    const isSelected = index === activeIndex;
                    return (
                        <View
                            key={`${item.value}-${index}`}
                            style={[styles.itemContainer, { height: itemHeight }]}
                        >
                            <Text
                                style={[
                                    styles.itemText,
                                    isSelected && styles.itemTextSelected
                                ]}
                                numberOfLines={1}
                            >
                                {item.label}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
    },
    selectionOverlay: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: FontSizes.md,
        fontFamily: FontFamily.body,
        color: 'rgba(255,255,255,0.4)',
    },
    itemTextSelected: {
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
        color: Colors.white,
    },
});
