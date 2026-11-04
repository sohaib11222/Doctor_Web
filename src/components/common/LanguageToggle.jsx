import { useLanguage } from '../../contexts/LanguageContext'

const LanguageToggle = ({ className = '' }) => {
  const { language, toggleLanguage, t } = useLanguage()
  const nextLanguage = language === 'it' ? t('common.english') : t('common.italian')

  return (
    <button
      type="button"
      className={`language-toggle ${className}`.trim()}
      onClick={toggleLanguage}
      data-i18n-ignore
      aria-label={t('common.switchTo', { language: nextLanguage })}
      title={t('common.switchTo', { language: nextLanguage })}
    >
      <i className="fa-solid fa-language" aria-hidden="true" />
      <span>{language === 'it' ? 'IT' : 'EN'}</span>
    </button>
  )
}

export default LanguageToggle
