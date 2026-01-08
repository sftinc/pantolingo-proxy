'use client'

import { useMemo } from 'react'

// Types
type StandaloneKind = 'N' | 'P' | 'S' | 'HG_VOID'
type PairedKind = 'HB' | 'HE' | 'HA' | 'HS' | 'HG'

type ASTNode =
	| { type: 'text'; content: string }
	| { type: 'standalone'; kind: StandaloneKind; index: number }
	| { type: 'paired'; kind: PairedKind; index: number; children: ASTNode[] }

interface Token {
	type: 'text' | 'open' | 'close' | 'standalone'
	content: string
	kind?: string
	index?: number
	start: number
	end: number
}

// Constants
const PLACEHOLDER_REGEX = /\[(\/?[A-Z]+)(\d+)\]/g

const STANDALONE_LABELS: Record<StandaloneKind, string> = {
	N: 'number',
	P: 'email',
	S: 'skip',
	HG_VOID: 'element',
}

const PAIRED_LABELS: Record<PairedKind, string> = {
	HB: 'bold',
	HE: 'emphasis',
	HA: 'anchor',
	HS: 'span',
	HG: 'element',
}

const STANDALONE_COLORS: Record<StandaloneKind, string> = {
	N: 'var(--ph-number)',
	P: 'var(--ph-email)',
	S: 'var(--ph-skip)',
	HG_VOID: 'var(--ph-void)',
}

const PAIRED_COLORS: Record<PairedKind, string> = {
	HB: 'var(--ph-bold)',
	HE: 'var(--ph-emphasis)',
	HA: 'var(--ph-anchor)',
	HS: 'var(--ph-span)',
	HG: 'var(--ph-generic)',
}

// Check if a closing tag exists for HG
function hasClosingTag(text: string, kind: string, index: number): boolean {
	const closingTag = `[/${kind}${index}]`
	return text.includes(closingTag)
}

// Tokenize text into segments
function tokenize(text: string): Token[] {
	const tokens: Token[] = []
	let lastIndex = 0

	// Find all placeholders and check for HG closing tags
	const matches: Array<{ match: RegExpExecArray; isClosing: boolean; kind: string; index: number }> = []
	let match: RegExpExecArray | null

	while ((match = PLACEHOLDER_REGEX.exec(text)) !== null) {
		const fullMatch = match[0]
		const kindPart = match[1]
		const indexPart = parseInt(match[2], 10)
		const isClosing = kindPart.startsWith('/')
		const kind = isClosing ? kindPart.slice(1) : kindPart

		matches.push({
			match,
			isClosing,
			kind,
			index: indexPart,
		})
	}

	// Process matches
	for (const { match, isClosing, kind, index } of matches) {
		const start = match.index
		const end = start + match[0].length

		// Add text before this token
		if (start > lastIndex) {
			tokens.push({
				type: 'text',
				content: text.slice(lastIndex, start),
				start: lastIndex,
				end: start,
			})
		}

		// Determine token type
		if (isClosing) {
			tokens.push({
				type: 'close',
				content: match[0],
				kind,
				index,
				start,
				end,
			})
		} else if (['N', 'P', 'S'].includes(kind)) {
			// Always standalone
			tokens.push({
				type: 'standalone',
				content: match[0],
				kind,
				index,
				start,
				end,
			})
		} else if (['HB', 'HE', 'HA', 'HS'].includes(kind)) {
			// Always paired (opening tag)
			tokens.push({
				type: 'open',
				content: match[0],
				kind,
				index,
				start,
				end,
			})
		} else if (kind === 'HG') {
			// HG can be standalone (void) or paired - check if closing tag exists
			if (hasClosingTag(text, kind, index)) {
				tokens.push({
					type: 'open',
					content: match[0],
					kind,
					index,
					start,
					end,
				})
			} else {
				tokens.push({
					type: 'standalone',
					content: match[0],
					kind: 'HG_VOID',
					index,
					start,
					end,
				})
			}
		}

		lastIndex = end
	}

	// Add remaining text
	if (lastIndex < text.length) {
		tokens.push({
			type: 'text',
			content: text.slice(lastIndex),
			start: lastIndex,
			end: text.length,
		})
	}

	return tokens
}

// Parse tokens into AST with nesting support
function parseToAST(tokens: Token[]): ASTNode[] {
	const result: ASTNode[] = []
	const stack: Array<{ kind: PairedKind; index: number; children: ASTNode[] }> = []

	for (const token of tokens) {
		const current = stack.length > 0 ? stack[stack.length - 1].children : result

		switch (token.type) {
			case 'text':
				current.push({ type: 'text', content: token.content })
				break

			case 'standalone':
				current.push({
					type: 'standalone',
					kind: token.kind as StandaloneKind,
					index: token.index!,
				})
				break

			case 'open':
				stack.push({
					kind: token.kind as PairedKind,
					index: token.index!,
					children: [],
				})
				break

			case 'close':
				// Find matching open tag
				for (let i = stack.length - 1; i >= 0; i--) {
					if (stack[i].kind === token.kind && stack[i].index === token.index) {
						// Pop all items from i to end
						const closed = stack.splice(i)
						const node = closed[0]

						// If there were unclosed tags between, add their children to this node
						for (let j = 1; j < closed.length; j++) {
							node.children.push(...closed[j].children)
						}

						const target = stack.length > 0 ? stack[stack.length - 1].children : result
						target.push({
							type: 'paired',
							kind: node.kind,
							index: node.index,
							children: node.children,
						})
						break
					}
				}
				break
		}
	}

	// Handle any unclosed tags - add their children to result
	for (const unclosed of stack) {
		result.push(...unclosed.children)
	}

	return result
}

// Render components
function StandaloneBadge({ kind }: { kind: StandaloneKind }) {
	const label = STANDALONE_LABELS[kind]
	const color = STANDALONE_COLORS[kind]

	return (
		<span
			className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium mx-0.5 whitespace-nowrap"
			style={{
				backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
				color: color,
			}}
		>
			{label}
		</span>
	)
}

function PairedWrapper({ kind, children }: { kind: PairedKind; children: React.ReactNode }) {
	const label = PAIRED_LABELS[kind]
	const color = PAIRED_COLORS[kind]

	return (
		<span
			className="relative group/placeholder inline-block rounded-sm px-1.5 py-0.5"
			style={{
				backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
			}}
		>
			<span
				className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-xs rounded opacity-0 group-hover/placeholder:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 text-white"
				style={{ backgroundColor: color }}
			>
				{label}
			</span>
			{children}
		</span>
	)
}

function renderAST(nodes: ASTNode[], keyPrefix = ''): React.ReactNode[] {
	return nodes.map((node, i) => {
		const key = `${keyPrefix}${i}`

		switch (node.type) {
			case 'text':
				// Render text directly without wrapper to inherit parent color
				return node.content

			case 'standalone':
				return <StandaloneBadge key={key} kind={node.kind} />

			case 'paired':
				return (
					<PairedWrapper key={key} kind={node.kind}>
						{renderAST(node.children, `${key}-`)}
					</PairedWrapper>
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
