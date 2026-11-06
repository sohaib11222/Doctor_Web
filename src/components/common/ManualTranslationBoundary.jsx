import { useEffect, useRef } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'])
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt']

const isEligibleTextNode = (node) => {
  const parent = node.parentElement
  if (!parent || SKIPPED_TAGS.has(parent.tagName) || parent.closest('[data-i18n-skip]')) return false
  return Boolean(node.nodeValue && node.nodeValue.trim())
}

// Legacy dashboard pages contain reviewed, static English copy mixed with API
// data. Translating text nodes through the central manual catalogue means old
// screens, Bootstrap modals, and content mounted after an interaction remain
// synchronized with the selected language without translating user-authored
// names, messages, or clinical data that is not in the reviewed catalogue.
const ManualTranslationBoundary = ({ children, enabled = true }) => {
  const rootRef = useRef(null)
  const { language, translateText: tr } = useLanguage()

  useEffect(() => {
    if (!enabled || !rootRef.current) return undefined
    const root = rootRef.current

    const translateElement = (element) => {
      if (!(element instanceof HTMLElement) || element.closest('[data-i18n-skip]')) return
      TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
        const value = element.getAttribute(attribute)
        if (!value) return
        const translated = tr(value)
        if (translated !== value) element.setAttribute(attribute, translated)
      })
    }

    const translateNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!isEligibleTextNode(node)) return
        const translated = tr(node.nodeValue)
        if (translated !== node.nodeValue) node.nodeValue = translated
        return
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return
      translateElement(node)
      node.childNodes.forEach(translateNode)
    }

    translateNode(root)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') translateNode(mutation.target)
        mutation.addedNodes.forEach(translateNode)
      })
    })
    observer.observe(root, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [enabled, language, tr])

  return <div ref={rootRef} data-manual-i18n-boundary>{children}</div>
}

export default ManualTranslationBoundary
