'use client'

import { useMemo } from 'react'
import {
	type ASTNode,
	tokenize,
	parseToAST,
	PlaceholderBadge,
	PlaceholderWrapper,
} from './placeholder-shared'

// Render AST to React nodes
function renderAST(nodes: ASTNode[], keyPrefix = ''): React.ReactNode[] {
	return nodes.map((node, i) => {
		const key = `${keyPrefix}${i}`

		switch (node.type) {
			case 'text':
				// Render text directly without wrapper to inherit parent color
				return node.content

			case 'standalone':
				return <PlaceholderBadge key={key} kind={node.kind} />

			case 'paired':
				return (
					<PlaceholderWrapper key={key} kind={node.kind}>
						{renderAST(node.children, `${key}-`)}
					</PlaceholderWrapper>
				)
		}
	})
}

// Main component
interface PlaceholderTextProps {
	text: string
	className?: string
}

export function PlaceholderText({ text, className }: PlaceholderTextProps) {
	const ast = useMemo(() => {
		const tokens = tokenize(text)
		return parseToAST(tokens)
	}, [text])

	return <span className={className}>{renderAST(ast)}</span>
}
