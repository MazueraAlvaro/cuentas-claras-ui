import React from "react";
import { Link } from "react-router-dom";

export const SideNav: React.FC = () => {
  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">PANEL PRINCIPAL</div>
            <Link className="nav-link" to="/">
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              Inicio
            </Link>
            <div className="sb-sidenav-menu-heading">ADMIN</div>
            <Link className="nav-link" to="/expenses">
              <div className="sb-nav-link-icon">
                <i className="fas fa-money-check-dollar"></i>
              </div>
              Gastos
            </Link>
            <Link className="nav-link" to="/incomes">
              <div className="sb-nav-link-icon">
                <i className="fas fa-hand-holding-dollar"></i>
              </div>
              Ingresos
            </Link>
          </div>
        </div>
        <div className="sb-sidenav-footer">
          <div className="small">Powered By</div>
          @mazueraalvaro
        </div>
      </nav>
    </div>
  );
};
