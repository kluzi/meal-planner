return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', overflowY:'auto'}}>
      {/* ── Topbar ── */}
      <div className={styles.topbar}>
        <div className={styles.pageTitle}>Planning</div>
        <div className={styles.topbarRight}>
          <button className={styles.iconBtn} onClick={onTriggerAI} title="Générer avec l'IA">
            <StarIcon />
          </button>
          <button className={styles.iconBtn} onClick={onCopyPrevWeek} title="Reprendre la semaine dernière">
            <RepeatIcon />
          </button>
          <button className={`${styles.iconBtn} ${styles.iconBtnAccent}`} onClick={onOpenLibrary} title="Mes repas">
            <GridIcon />
          </button>
        </div>
      </div>

      {/* ── Week nav ── */}
      <div className={styles.weekNavRow}>
        <div className={styles.weekNavCard}>
          <button className={styles.navArr} onClick={onPrevWeek}><ChevronLeft /></button>
          <span className={styles.weekLbl}>{formatWeekLabel(monday)}</span>
          <button className={styles.navArr} onClick={onNextWeek}><ChevronRight /></button>
        </div>
        {loadingWeek && <span className={styles.loadingDot} />}
      </div>

      {/* ── Grille ── */}
      <div style={{padding: '0 18px'}}>
        <div className={styles.gridWrap}>
          <div className={styles.sideCol}>
            <div className={styles.sideSpacer} />
            <div className={styles.sidePill}>
              <SunIcon />
              <span className={styles.sideTxt}>Midi</span>
            </div>
            <div className={styles.sidePill}>
              <MoonIcon />
              <span className={styles.sideTxt}>Soir</span>
            </div>
          </div>

          <div className={styles.gridCols}>
            <div className={styles.dayHeaders}>
              {Array.from({ length: 7 }, (_, di) => {
                const date = addDays(monday, di)
                const today = isToday(date)
                return (
                  <div key={di} className={styles.dh}>
                    <span className={styles.dhName}>{DAY_NAMES[di]}</span>
                    <span className={`${styles.dhNum} ${today ? styles.dhToday : ''}`}>
                      {date.getDate()}
                    </span>
                  </div>
                )
              })}
            </div>

            {[0, 1].map(si => (
              <div key={si} className={styles.mealRow}>
                {Array.from({ length: 7 }, (_, di) => (
                  <MealCard
                    key={di}
                    meal={slots[di]?.[si] ?? null}
                    di={di} si={si}
                    onOpen={onOpenDetail}
                    onSelect={onOpenSelector}
                    onRegen={onRegenSlot}
                    onValidate={onValidateSlot}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Récapitulatif ── */}
        <div className={styles.recapRow}>
          <div className={styles.recapBand}>
            {RECAP_FILTERS.map(r => {
              const n = counts[r.key]
              return (
                <div key={r.key} className={`${styles.recapPill} ${n === 0 ? styles.recapZero : ''}`}>
                  <span className={styles.recapDot} style={{ background: r.dot }} />
                  <span className={styles.recapNum} style={{ color: n > 0 ? r.dot : 'var(--text-3)' }}>{n}</span>
                  <span className={styles.recapLbl}> {r.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Liste de courses ── */}
        <div className={styles.sectionHdr}>
          Liste de courses
          {groceryCount > 0 && (
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-3)', marginLeft: 6 }}>
              {groceryCount} articles
            </span>
          )}
        </div>
        <GroceryList slots={slots} />
      </div>
    </div>
  )
