"use client";

import PersonalityBubbleGame from "./PersonalityBubbleGame";
import { PersonalityBubble } from "./types";

interface PersonalityGameWrapperProps {
    roundNumber: number;
    onComplete: (selectedIds: string[]) => void;
}

// Round 0: Life Values - What matters most to you in life
const round0Bubbles: PersonalityBubble[] = [
    {
        id: "financial_security",
        emoji: "💰",
        label: "ความมั่นคงทางการเงิน",
        size: "large",
        position: { x: 30, y: 20 },
        category: "finance",
    },
    {
        id: "family",
        emoji: "👨‍👩‍👧",
        label: "ครอบครัว",
        size: "medium",
        position: { x: 70, y: 18 },
        category: "social",
    },
    {
        id: "career_success",
        emoji: "🏆",
        label: "ความสำเร็จในงาน",
        size: "medium",
        position: { x: 50, y: 35 },
        category: "career",
    },
    {
        id: "happiness",
        emoji: "😊",
        label: "ความสุข",
        size: "large",
        position: { x: 25, y: 55 },
        category: "wellness",
    },
    {
        id: "growth",
        emoji: "🌱",
        label: "การเติบโต",
        size: "small",
        position: { x: 75, y: 50 },
        category: "personal",
    },
    {
        id: "freedom",
        emoji: "🗽",
        label: "เสรีภาพ",
        size: "medium",
        position: { x: 45, y: 68 },
        category: "lifestyle",
    },
    {
        id: "health",
        emoji: "💪",
        label: "สุขภาพ",
        size: "large",
        position: { x: 65, y: 75 },
        category: "wellness",
    },
    {
        id: "friendship",
        emoji: "🤝",
        label: "มิตรภาพ",
        size: "small",
        position: { x: 28, y: 82 },
        category: "social",
    },
    {
        id: "creativity",
        emoji: "💡",
        label: "ความคิดสร้างสรรค์",
        size: "medium",
        position: { x: 80, y: 85 },
        category: "personal",
    },
    {
        id: "balance",
        emoji: "⚖️",
        label: "ความสมดุล",
        size: "small",
        position: { x: 52, y: 90 },
        category: "lifestyle",
    },
];

// Round 1: Spending Habits - What you spend money on most
const round1Bubbles: PersonalityBubble[] = [
    {
        id: "food_cafe",
        emoji: "🍽️",
        label: "อาหาร/คาเฟ่",
        size: "large",
        position: { x: 28, y: 22 },
        category: "lifestyle",
    },
    {
        id: "fashion",
        emoji: "👗",
        label: "เสื้อผ้า/แฟชั่น",
        size: "medium",
        position: { x: 68, y: 20 },
        category: "lifestyle",
    },
    {
        id: "travel",
        emoji: "✈️",
        label: "ท่องเที่ยว",
        size: "large",
        position: { x: 48, y: 38 },
        category: "lifestyle",
    },
    {
        id: "beauty",
        emoji: "💄",
        label: "ความงาม/skincare",
        size: "medium",
        position: { x: 22, y: 58 },
        category: "lifestyle",
    },
    {
        id: "technology",
        emoji: "📱",
        label: "เทคโนโลยี/gadgets",
        size: "small",
        position: { x: 75, y: 52 },
        category: "lifestyle",
    },
    {
        id: "home_decor",
        emoji: "🏠",
        label: "บ้าน/ตกแต่ง",
        size: "medium",
        position: { x: 55, y: 65 },
        category: "lifestyle",
    },
    {
        id: "education",
        emoji: "🎓",
        label: "คอร์สเรียน/หนังสือ",
        size: "medium",
        position: { x: 30, y: 78 },
        category: "personal",
    },
    {
        id: "fitness",
        emoji: "🏋️",
        label: "ฟิตเนส/สุขภาพ",
        size: "small",
        position: { x: 72, y: 75 },
        category: "wellness",
    },
    {
        id: "entertainment",
        emoji: "🎬",
        label: "บันเทิง (หนัง/คอนเสิร์ต)",
        size: "large",
        position: { x: 45, y: 88 },
        category: "lifestyle",
    },
    {
        id: "gifts",
        emoji: "🎁",
        label: "ของขวัญให้คนอื่น",
        size: "small",
        position: { x: 18, y: 92 },
        category: "social",
    },
];

// Round 2: Future Goals - Where you want to be in 5 years
const round2Bubbles: PersonalityBubble[] = [
    {
        id: "career_success_future",
        emoji: "💼",
        label: "ประสบความสำเร็จในงาน",
        size: "large",
        position: { x: 32, y: 20 },
        category: "career",
    },
    {
        id: "financial_stability",
        emoji: "💰",
        label: "มั่นคงทางการเงิน",
        size: "medium",
        position: { x: 70, y: 22 },
        category: "finance",
    },
    {
        id: "world_travel",
        emoji: "✈️",
        label: "เที่ยวได้ทั่วโลก",
        size: "medium",
        position: { x: 48, y: 38 },
        category: "lifestyle",
    },
    {
        id: "warm_family",
        emoji: "👨‍👩‍👧",
        label: "มีครอบครัวที่อบอุ่น",
        size: "large",
        position: { x: 25, y: 58 },
        category: "social",
    },
    {
        id: "own_home",
        emoji: "🏠",
        label: "มีบ้านของตัวเอง",
        size: "small",
        position: { x: 75, y: 55 },
        category: "finance",
    },
    {
        id: "mastery",
        emoji: "🎓",
        label: "เก่งในสิ่งที่ทำ",
        size: "medium",
        position: { x: 58, y: 68 },
        category: "personal",
    },
    {
        id: "strong_health",
        emoji: "💪",
        label: "สุขภาพแข็งแรง",
        size: "medium",
        position: { x: 30, y: 78 },
        category: "wellness",
    },
    {
        id: "happiness_future",
        emoji: "😌",
        label: "มีความสุข",
        size: "large",
        position: { x: 68, y: 80 },
        category: "wellness",
    },
    {
        id: "life_freedom",
        emoji: "🗽",
        label: "มีอิสระในชีวิต",
        size: "small",
        position: { x: 42, y: 88 },
        category: "lifestyle",
    },
    {
        id: "better_person",
        emoji: "🌱",
        label: "เป็นคนที่ดีขึ้น",
        size: "small",
        position: { x: 78, y: 92 },
        category: "personal",
    },
];

// Configuration for each round
const roundConfigs = [
    {
        title: "สิ่งที่คุณให้คุณค่ามากที่สุดในชีวิต 💝",
        subtitle: "Pick the 3 items that are most important to you",
        maxSelections: 3,
        bubbles: round0Bubbles,
    },
    {
        title: "คุณใช้จ่ายเงินกับอะไรมากที่สุด? 💸",
        subtitle: "Pick the 3 items where you spend money most",
        maxSelections: 3,
        bubbles: round1Bubbles,
    },
    {
        title: "ในอีก 5 ปี คุณอยากเป็นยังไง? 🌟",
        subtitle: "Pick the 3 things you want to achieve in 5 years",
        maxSelections: 3,
        bubbles: round2Bubbles,
    },
];

export default function PersonalityGameWrapper({
    roundNumber,
    onComplete,
}: PersonalityGameWrapperProps) {
    // Get config for current round, default to round 0 if invalid
    const config = roundConfigs[roundNumber] || roundConfigs[0];

    return (
        <PersonalityBubbleGame
            title={config.title}
            subtitle={config.subtitle}
            maxSelections={config.maxSelections}
            bubbles={config.bubbles}
            onComplete={onComplete}
        />
    );
}
