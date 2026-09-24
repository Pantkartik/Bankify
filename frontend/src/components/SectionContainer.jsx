import React from 'react'

const SectionContainer = ( { children, extraStyles } ) => {
  return (
    <section 
      id='actions-section' 
      className={`w-full flex flex-col border border-gray-200 text-xl bg-white rounded-xl p-6 gap-6 shadow-xl ${extraStyles || ''}`}
      style={{ marginTop: '1rem' }}
    >
      {children}
    </section>
  )
}

export default SectionContainer