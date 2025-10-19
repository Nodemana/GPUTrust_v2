import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

interface GraphCardProps {
    title: string;
    graph: React.ReactElement;
    className?: string;
}

export function GraphCard({ title, graph, className = '' }: GraphCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="p-0">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {graph}
            </CardContent>
        </Card>
    );
}