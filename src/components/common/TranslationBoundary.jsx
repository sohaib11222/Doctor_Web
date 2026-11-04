import { useEffect, useRef } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

// Legacy pages still contain literal JSX strings.  This boundary applies the
// same reviewed catalogue to those strings and to DOM content added after the
// page has mounted.  New/changed components should prefer useLanguage().t()
// with a named key; this keeps the migration safe while preventing mixed UI.
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt']
const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA'])

const TranslationBoundary = ({ children }) => {
  const { language, translateText } = useLanguage()
  const rootRef = useRef(null)
  const textSources = useRef(new WeakMap())
  const attributeSources = useRef(new WeakMap())

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const shouldSkip = (element) => !element || SKIPPED_TAGS.has(element.tagName) || element.closest?.('[data-i18n-ignore]')

    const translateTextNode = (node) => {
      if (!node?.nodeValue || shouldSkip(node.parentElement)) return
      let source = textSources.current.get(node)
      if (source === undefined) {
        source = translateText(node.nodeValue, 'en')
        textSources.current.set(node, source)
      }
      const translated = translateText(source, language)
      if (node.nodeValue !== translated) node.nodeValue = translated
    }

    const translateAttribute = (element, attribute) => {
      if (shouldSkip(element) || !element.hasAttribute(attribute)) return
      let sources = attributeSources.current.get(element)
      if (!sources) {
        sources = new Map()
        attributeSources.current.set(element, sources)
      }
      let source = sources.get(attribute)
      if (source === undefined) {
        source = translateText(element.getAttribute(attribute), 'en')
        sources.set(attribute, source)
      }
      const translated = translateText(source, language)
      if (element.getAttribute(attribute) !== translated) element.setAttribute(attribute, translated)
    }

    const translateTree = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        translateTextNode(node)
        return
      }
      if (node.nodeType !== Node.ELEMENT_NODE || shouldSkip(node)) return
      TRANSLATABLE_ATTRIBUTES.forEach(attribute => translateAttribute(node, attribute))
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
      let textNode = walker.nextNode()
      while (textNode) {
        translateTextNode(textNode)
        textNode = walker.nextNode()
      }
      node.querySelectorAll?.(TRANSLATABLE_ATTRIBUTES.map(attribute => `[${attribute}]`).join(',')).forEach(element => {
        TRANSLATABLE_ATTRIBUTES.forEach(attribute => translateAttribute(element, attribute))
      })
    }

    translateTree(root)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') translateTextNode(mutation.target)
        if (mutation.type === 'attributes') translateAttribute(mutation.target, mutation.attributeName)
        mutation.addedNodes.forEach(translateTree)
      })
    })
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: TRANSLATABLE_ATTRIBUTES })
    return () => observer.disconnect()
  }, [language, translateText])

  return <div ref={rootRef} className="language-boundary">{children}</div>
}

export default TranslationBoundary
