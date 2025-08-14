/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./src/components/AuthContext.tsx":
/*!****************************************!*\
  !*** ./src/components/AuthContext.tsx ***!
  \****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\n/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./firebase */ \"(pages-dir-node)/./src/components/firebase.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_auth__WEBPACK_IMPORTED_MODULE_2__, _firebase__WEBPACK_IMPORTED_MODULE_3__]);\n([firebase_auth__WEBPACK_IMPORTED_MODULE_2__, _firebase__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n// Crea el contexto con un valor predeterminado indefinido\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\n// Componente Provider que envuelve tu aplicación y hace que el objeto auth esté disponible para cualquier componente hijo que llame a useAuth()\nconst AuthProvider = ({ children })=>{\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isAdmin, setIsAdmin] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"AuthProvider.useEffect\": ()=>{\n            const unsubscribe = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_2__.onAuthStateChanged)(_firebase__WEBPACK_IMPORTED_MODULE_3__.auth, {\n                \"AuthProvider.useEffect.unsubscribe\": (user)=>{\n                    setUser(user);\n                    // Verificar si el usuario es admin\n                    if (user) {\n                        setIsAdmin(user.email?.endsWith('@admin.ama.mx') || false);\n                    } else {\n                        setIsAdmin(false);\n                    }\n                    setLoading(false);\n                }\n            }[\"AuthProvider.useEffect.unsubscribe\"]);\n            return ({\n                \"AuthProvider.useEffect\": ()=>unsubscribe()\n            })[\"AuthProvider.useEffect\"];\n        }\n    }[\"AuthProvider.useEffect\"], []);\n    // Iniciar sesión con email y contraseña\n    const iniciarSesionConEmail = async (email, password)=>{\n        setLoading(true);\n        try {\n            await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_2__.signInWithEmailAndPassword)(_firebase__WEBPACK_IMPORTED_MODULE_3__.auth, email, password);\n            setError(null);\n        } catch (err) {\n            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');\n            console.error('Error al iniciar sesión:', err);\n        } finally{\n            setLoading(false);\n        }\n    };\n    // Iniciar sesión con Google\n    const iniciarSesionConGoogle = async ()=>{\n        setLoading(true);\n        try {\n            const provider = new firebase_auth__WEBPACK_IMPORTED_MODULE_2__.GoogleAuthProvider();\n            await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_2__.signInWithPopup)(_firebase__WEBPACK_IMPORTED_MODULE_3__.auth, provider);\n            setError(null);\n        } catch (err) {\n            setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google');\n            console.error('Error al iniciar sesión con Google:', err);\n        } finally{\n            setLoading(false);\n        }\n    };\n    // Cerrar sesión\n    const cerrarSesion = async ()=>{\n        setLoading(true);\n        try {\n            await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_2__.signOut)(_firebase__WEBPACK_IMPORTED_MODULE_3__.auth);\n            setError(null);\n        } catch (err) {\n            setError(err instanceof Error ? err.message : 'Error al cerrar sesión');\n            console.error('Error al cerrar sesión:', err);\n        } finally{\n            setLoading(false);\n        }\n    };\n    // El valor que se proporcionará a cualquier consumidor de este contexto\n    const value = {\n        user,\n        loading,\n        error,\n        isAdmin,\n        iniciarSesionConEmail,\n        iniciarSesionConGoogle,\n        cerrarSesion\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: !loading && children\n    }, void 0, false, {\n        fileName: \"C:\\\\xampp\\\\htdocs\\\\pw-traffic\\\\src\\\\components\\\\AuthContext.tsx\",\n        lineNumber: 86,\n        columnNumber: 5\n    }, undefined);\n};\n// Hook personalizado que simplifica el uso del contexto\nconst useAuth = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (!context) {\n        throw new Error('useAuth debe ser usado dentro de un AuthProvider');\n    }\n    return context;\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb21wb25lbnRzL0F1dGhDb250ZXh0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBOEU7QUFDcUQ7QUFDakc7QUFXbEMsMERBQTBEO0FBQzFELE1BQU1XLDRCQUFjVixvREFBYUEsQ0FBOEJXO0FBQy9ELGdKQUFnSjtBQUN6SSxNQUFNQyxlQUF3RCxDQUFDLEVBQUVDLFFBQVEsRUFBRTtJQUNoRixNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR1osK0NBQVFBLENBQWM7SUFDOUMsTUFBTSxDQUFDYSxTQUFTQyxXQUFXLEdBQUdkLCtDQUFRQSxDQUFVO0lBQ2hELE1BQU0sQ0FBQ2UsT0FBT0MsU0FBUyxHQUFHaEIsK0NBQVFBLENBQWdCO0lBQ2xELE1BQU0sQ0FBQ2lCLFNBQVNDLFdBQVcsR0FBR2xCLCtDQUFRQSxDQUFVO0lBQ2hERCxnREFBU0E7a0NBQUM7WUFDUixNQUFNb0IsY0FBY2xCLGlFQUFrQkEsQ0FBQ0ssMkNBQUlBO3NEQUFFLENBQUNLO29CQUM1Q0MsUUFBUUQ7b0JBQ1IsbUNBQW1DO29CQUNuQyxJQUFJQSxNQUFNO3dCQUNSTyxXQUFXUCxLQUFLUyxLQUFLLEVBQUVDLFNBQVMsb0JBQW9CO29CQUN0RCxPQUFPO3dCQUNMSCxXQUFXO29CQUNiO29CQUNBSixXQUFXO2dCQUNiOztZQUNBOzBDQUFPLElBQU1LOztRQUNmO2lDQUFHLEVBQUU7SUFDTCx3Q0FBd0M7SUFDeEMsTUFBTUcsd0JBQXdCLE9BQU9GLE9BQWVHO1FBQ2xEVCxXQUFXO1FBQ1gsSUFBSTtZQUNGLE1BQU1aLHlFQUEwQkEsQ0FBQ0ksMkNBQUlBLEVBQUVjLE9BQU9HO1lBQzlDUCxTQUFTO1FBQ1gsRUFBRSxPQUFPUSxLQUFLO1lBQ1pSLFNBQVNRLGVBQWVDLFFBQVFELElBQUlFLE9BQU8sR0FBRztZQUM5Q0MsUUFBUVosS0FBSyxDQUFDLDRCQUE0QlM7UUFDNUMsU0FBVTtZQUNSVixXQUFXO1FBQ2I7SUFDRjtJQUNBLDRCQUE0QjtJQUM1QixNQUFNYyx5QkFBeUI7UUFDN0JkLFdBQVc7UUFDWCxJQUFJO1lBQ0YsTUFBTWUsV0FBVyxJQUFJekIsNkRBQWtCQTtZQUN2QyxNQUFNQyw4REFBZUEsQ0FBQ0MsMkNBQUlBLEVBQUV1QjtZQUM1QmIsU0FBUztRQUNYLEVBQUUsT0FBT1EsS0FBSztZQUNaUixTQUFTUSxlQUFlQyxRQUFRRCxJQUFJRSxPQUFPLEdBQUc7WUFDOUNDLFFBQVFaLEtBQUssQ0FBQyx1Q0FBdUNTO1FBQ3ZELFNBQVU7WUFDUlYsV0FBVztRQUNiO0lBQ0Y7SUFDQSxnQkFBZ0I7SUFDaEIsTUFBTWdCLGVBQWU7UUFDbkJoQixXQUFXO1FBQ1gsSUFBSTtZQUNGLE1BQU1YLHNEQUFPQSxDQUFDRywyQ0FBSUE7WUFDbEJVLFNBQVM7UUFDWCxFQUFFLE9BQU9RLEtBQUs7WUFDWlIsU0FBU1EsZUFBZUMsUUFBUUQsSUFBSUUsT0FBTyxHQUFHO1lBQzlDQyxRQUFRWixLQUFLLENBQUMsMkJBQTJCUztRQUMzQyxTQUFVO1lBQ1JWLFdBQVc7UUFDYjtJQUNGO0lBQ0Esd0VBQXdFO0lBQ3hFLE1BQU1pQixRQUFRO1FBQ1pwQjtRQUNBRTtRQUNBRTtRQUNBRTtRQUNBSztRQUNBTTtRQUNBRTtJQUNGO0lBQ0EscUJBQ0UsOERBQUN2QixZQUFZeUIsUUFBUTtRQUFDRCxPQUFPQTtrQkFDMUIsQ0FBQ2xCLFdBQVdIOzs7Ozs7QUFHbkIsRUFBRTtBQUNGLHdEQUF3RDtBQUNqRCxNQUFNdUIsVUFBVTtJQUNyQixNQUFNQyxVQUFVcEMsaURBQVVBLENBQUNTO0lBQzNCLElBQUksQ0FBQzJCLFNBQVM7UUFDWixNQUFNLElBQUlULE1BQU07SUFDbEI7SUFDQSxPQUFPUztBQUNULEVBQUUiLCJzb3VyY2VzIjpbIkM6XFx4YW1wcFxcaHRkb2NzXFxwdy10cmFmZmljXFxzcmNcXGNvbXBvbmVudHNcXEF1dGhDb250ZXh0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgVXNlciwgb25BdXRoU3RhdGVDaGFuZ2VkLCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZCwgc2lnbk91dCwgR29vZ2xlQXV0aFByb3ZpZGVyLCBzaWduSW5XaXRoUG9wdXAgfSBmcm9tICdmaXJlYmFzZS9hdXRoJztcclxuaW1wb3J0IHsgYXV0aCB9IGZyb20gJy4vZmlyZWJhc2UnO1xyXG4vLyBEZWZpbmUgbGEgZXN0cnVjdHVyYSBkZWwgY29udGV4dG8gZGUgYXV0ZW50aWNhY2nDs25cclxuaW50ZXJmYWNlIEF1dGhDb250ZXh0VHlwZSB7XHJcbiAgdXNlcjogVXNlciB8IG51bGw7XHJcbiAgbG9hZGluZzogYm9vbGVhbjtcclxuICBlcnJvcjogc3RyaW5nIHwgbnVsbDtcclxuICBpc0FkbWluOiBib29sZWFuO1xyXG4gIGluaWNpYXJTZXNpb25Db25FbWFpbDogKGVtYWlsOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XHJcbiAgaW5pY2lhclNlc2lvbkNvbkdvb2dsZTogKCkgPT4gUHJvbWlzZTx2b2lkPjtcclxuICBjZXJyYXJTZXNpb246ICgpID0+IFByb21pc2U8dm9pZD47XHJcbn1cclxuLy8gQ3JlYSBlbCBjb250ZXh0byBjb24gdW4gdmFsb3IgcHJlZGV0ZXJtaW5hZG8gaW5kZWZpbmlkb1xyXG5jb25zdCBBdXRoQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8QXV0aENvbnRleHRUeXBlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xyXG4vLyBDb21wb25lbnRlIFByb3ZpZGVyIHF1ZSBlbnZ1ZWx2ZSB0dSBhcGxpY2FjacOzbiB5IGhhY2UgcXVlIGVsIG9iamV0byBhdXRoIGVzdMOpIGRpc3BvbmlibGUgcGFyYSBjdWFscXVpZXIgY29tcG9uZW50ZSBoaWpvIHF1ZSBsbGFtZSBhIHVzZUF1dGgoKVxyXG5leHBvcnQgY29uc3QgQXV0aFByb3ZpZGVyOiBSZWFjdC5GQzx7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfT4gPSAoeyBjaGlsZHJlbiB9KSA9PiB7XHJcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGU8VXNlciB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlPGJvb2xlYW4+KHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW2lzQWRtaW4sIHNldElzQWRtaW5dID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCB1bnN1YnNjcmliZSA9IG9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCAodXNlcikgPT4ge1xyXG4gICAgICBzZXRVc2VyKHVzZXIpO1xyXG4gICAgICAvLyBWZXJpZmljYXIgc2kgZWwgdXN1YXJpbyBlcyBhZG1pblxyXG4gICAgICBpZiAodXNlcikge1xyXG4gICAgICAgIHNldElzQWRtaW4odXNlci5lbWFpbD8uZW5kc1dpdGgoJ0BhZG1pbi5hbWEubXgnKSB8fCBmYWxzZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0SXNBZG1pbihmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiAoKSA9PiB1bnN1YnNjcmliZSgpO1xyXG4gIH0sIFtdKTtcclxuICAvLyBJbmljaWFyIHNlc2nDs24gY29uIGVtYWlsIHkgY29udHJhc2XDsWFcclxuICBjb25zdCBpbmljaWFyU2VzaW9uQ29uRW1haWwgPSBhc3luYyAoZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4ge1xyXG4gICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGF1dGgsIGVtYWlsLCBwYXNzd29yZCk7XHJcbiAgICAgIHNldEVycm9yKG51bGwpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHNldEVycm9yKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiAnRXJyb3IgYWwgaW5pY2lhciBzZXNpw7NuJyk7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFsIGluaWNpYXIgc2VzacOzbjonLCBlcnIpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICAvLyBJbmljaWFyIHNlc2nDs24gY29uIEdvb2dsZVxyXG4gIGNvbnN0IGluaWNpYXJTZXNpb25Db25Hb29nbGUgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgR29vZ2xlQXV0aFByb3ZpZGVyKCk7XHJcbiAgICAgIGF3YWl0IHNpZ25JbldpdGhQb3B1cChhdXRoLCBwcm92aWRlcik7XHJcbiAgICAgIHNldEVycm9yKG51bGwpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHNldEVycm9yKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiAnRXJyb3IgYWwgaW5pY2lhciBzZXNpw7NuIGNvbiBHb29nbGUnKTtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgaW5pY2lhciBzZXNpw7NuIGNvbiBHb29nbGU6JywgZXJyKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgLy8gQ2VycmFyIHNlc2nDs25cclxuICBjb25zdCBjZXJyYXJTZXNpb24gPSBhc3luYyAoKSA9PiB7XHJcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgc2lnbk91dChhdXRoKTtcclxuICAgICAgc2V0RXJyb3IobnVsbCk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgc2V0RXJyb3IoZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6ICdFcnJvciBhbCBjZXJyYXIgc2VzacOzbicpO1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhbCBjZXJyYXIgc2VzacOzbjonLCBlcnIpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICAvLyBFbCB2YWxvciBxdWUgc2UgcHJvcG9yY2lvbmFyw6EgYSBjdWFscXVpZXIgY29uc3VtaWRvciBkZSBlc3RlIGNvbnRleHRvXHJcbiAgY29uc3QgdmFsdWUgPSB7XHJcbiAgICB1c2VyLFxyXG4gICAgbG9hZGluZyxcclxuICAgIGVycm9yLFxyXG4gICAgaXNBZG1pbixcclxuICAgIGluaWNpYXJTZXNpb25Db25FbWFpbCxcclxuICAgIGluaWNpYXJTZXNpb25Db25Hb29nbGUsXHJcbiAgICBjZXJyYXJTZXNpb25cclxuICB9O1xyXG4gIHJldHVybiAoXHJcbiAgICA8QXV0aENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT5cclxuICAgICAgeyFsb2FkaW5nICYmIGNoaWxkcmVufVxyXG4gICAgPC9BdXRoQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59O1xyXG4vLyBIb29rIHBlcnNvbmFsaXphZG8gcXVlIHNpbXBsaWZpY2EgZWwgdXNvIGRlbCBjb250ZXh0b1xyXG5leHBvcnQgY29uc3QgdXNlQXV0aCA9ICgpID0+IHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGggZGViZSBzZXIgdXNhZG8gZGVudHJvIGRlIHVuIEF1dGhQcm92aWRlcicpO1xyXG4gIH1cclxuICByZXR1cm4gY29udGV4dDtcclxufTsiXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwib25BdXRoU3RhdGVDaGFuZ2VkIiwic2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQiLCJzaWduT3V0IiwiR29vZ2xlQXV0aFByb3ZpZGVyIiwic2lnbkluV2l0aFBvcHVwIiwiYXV0aCIsIkF1dGhDb250ZXh0IiwidW5kZWZpbmVkIiwiQXV0aFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ1c2VyIiwic2V0VXNlciIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsImlzQWRtaW4iLCJzZXRJc0FkbWluIiwidW5zdWJzY3JpYmUiLCJlbWFpbCIsImVuZHNXaXRoIiwiaW5pY2lhclNlc2lvbkNvbkVtYWlsIiwicGFzc3dvcmQiLCJlcnIiLCJFcnJvciIsIm1lc3NhZ2UiLCJjb25zb2xlIiwiaW5pY2lhclNlc2lvbkNvbkdvb2dsZSIsInByb3ZpZGVyIiwiY2VycmFyU2VzaW9uIiwidmFsdWUiLCJQcm92aWRlciIsInVzZUF1dGgiLCJjb250ZXh0Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/components/AuthContext.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./src/components/firebase.js":
/*!************************************!*\
  !*** ./src/components/firebase.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   auth: () => (/* binding */ auth),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ \"firebase/app\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__]);\n([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\nconst firebaseConfig = {\n    apiKey: \"AIzaSyDH8du-Pdl5OshdUpJP2U-J-yfeUQMfbWE\",\n    authDomain: \"gruas-d5b00.firebaseapp.com\",\n    projectId: \"gruas-d5b00\",\n    storageBucket: \"gruas-d5b00.appspot.com\",\n    messagingSenderId: \"790191029265\",\n    appId: \"1:790191029265:web:567c266f135ee20b6ec5b0\",\n    measurementId: \"G-BCWQKC6ZRV\"\n};\nconst app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig);\nconst auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.getAuth)(app);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9jb21wb25lbnRzL2ZpcmViYXNlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBNkM7QUFDTDtBQUN4QyxNQUFNRSxpQkFBaUI7SUFDbkJDLFFBQVE7SUFDUkMsWUFBWTtJQUNaQyxXQUFXO0lBQ1hDLGVBQWU7SUFDZkMsbUJBQW1CO0lBQ25CQyxPQUFPO0lBQ1BDLGVBQWU7QUFDbkI7QUFDQSxNQUFNQyxNQUFNViwyREFBYUEsQ0FBQ0U7QUFDbkIsTUFBTVMsT0FBT1Ysc0RBQU9BLENBQUNTLEtBQUs7QUFDakMsaUVBQWVBLEdBQUdBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFx4YW1wcFxcaHRkb2NzXFxwdy10cmFmZmljXFxzcmNcXGNvbXBvbmVudHNcXGZpcmViYXNlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRpYWxpemVBcHAgfSBmcm9tICdmaXJlYmFzZS9hcHAnO1xyXG5pbXBvcnQgeyBnZXRBdXRoIH0gZnJvbSAnZmlyZWJhc2UvYXV0aCc7XHJcbmNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xyXG4gICAgYXBpS2V5OiBcIkFJemFTeURIOGR1LVBkbDVPc2hkVXBKUDJVLUoteWZlVVFNZmJXRVwiLFxyXG4gICAgYXV0aERvbWFpbjogXCJncnVhcy1kNWIwMC5maXJlYmFzZWFwcC5jb21cIixcclxuICAgIHByb2plY3RJZDogXCJncnVhcy1kNWIwMFwiLFxyXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJncnVhcy1kNWIwMC5hcHBzcG90LmNvbVwiLFxyXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNzkwMTkxMDI5MjY1XCIsXHJcbiAgICBhcHBJZDogXCIxOjc5MDE5MTAyOTI2NTp3ZWI6NTY3YzI2NmYxMzVlZTIwYjZlYzViMFwiLFxyXG4gICAgbWVhc3VyZW1lbnRJZDogXCJHLUJDV1FLQzZaUlZcIlxyXG59O1xyXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcclxuZXhwb3J0IGNvbnN0IGF1dGggPSBnZXRBdXRoKGFwcCk7XHJcbmV4cG9ydCBkZWZhdWx0IGFwcDsiXSwibmFtZXMiOlsiaW5pdGlhbGl6ZUFwcCIsImdldEF1dGgiLCJmaXJlYmFzZUNvbmZpZyIsImFwaUtleSIsImF1dGhEb21haW4iLCJwcm9qZWN0SWQiLCJzdG9yYWdlQnVja2V0IiwibWVzc2FnaW5nU2VuZGVySWQiLCJhcHBJZCIsIm1lYXN1cmVtZW50SWQiLCJhcHAiLCJhdXRoIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/components/firebase.js\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_variables_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/variables.css */ \"(pages-dir-node)/./src/styles/variables.css\");\n/* harmony import */ var _styles_variables_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_variables_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/styles/globals.css */ \"(pages-dir-node)/./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_animations_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/styles/animations.css */ \"(pages-dir-node)/./src/styles/animations.css\");\n/* harmony import */ var _styles_animations_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_animations_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/AuthContext */ \"(pages-dir-node)/./src/components/AuthContext.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_AuthContext__WEBPACK_IMPORTED_MODULE_4__]);\n_components_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_AuthContext__WEBPACK_IMPORTED_MODULE_4__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"app-container\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"C:\\\\xampp\\\\htdocs\\\\pw-traffic\\\\src\\\\pages\\\\_app.tsx\",\n                lineNumber: 11,\n                columnNumber: 17\n            }, this)\n        }, void 0, false, {\n            fileName: \"C:\\\\xampp\\\\htdocs\\\\pw-traffic\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 10,\n            columnNumber: 13\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\xampp\\\\htdocs\\\\pw-traffic\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 9,\n        columnNumber: 9\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFnQztBQUNGO0FBQ0c7QUFFd0I7QUFFekQsU0FBU0MsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM3QyxxQkFDSSw4REFBQ0gsaUVBQVlBO2tCQUNULDRFQUFDSTtZQUFJQyxXQUFVO3NCQUNYLDRFQUFDSDtnQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7O0FBSXhDO0FBRUEsaUVBQWVGLEtBQUtBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFx4YW1wcFxcaHRkb2NzXFxwdy10cmFmZmljXFxzcmNcXHBhZ2VzXFxfYXBwLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ0Avc3R5bGVzL3ZhcmlhYmxlcy5jc3MnOyAgXHJcbmltcG9ydCAnQC9zdHlsZXMvZ2xvYmFscy5jc3MnOyAgICBcclxuaW1wb3J0ICdAL3N0eWxlcy9hbmltYXRpb25zLmNzcyc7XHJcbmltcG9ydCB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xyXG5pbXBvcnQgeyBBdXRoUHJvdmlkZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL0F1dGhDb250ZXh0JztcclxuXHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPEF1dGhQcm92aWRlcj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhcHAtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvQXV0aFByb3ZpZGVyPlxyXG4gICAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7XHJcbiJdLCJuYW1lcyI6WyJBdXRoUHJvdmlkZXIiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImRpdiIsImNsYXNzTmFtZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./src/styles/animations.css":
/*!***********************************!*\
  !*** ./src/styles/animations.css ***!
  \***********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./src/styles/variables.css":
/*!**********************************!*\
  !*** ./src/styles/variables.css ***!
  \**********************************/
/***/ (() => {



/***/ }),

/***/ "firebase/app":
/*!*******************************!*\
  !*** external "firebase/app" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/app");;

/***/ }),

/***/ "firebase/auth":
/*!********************************!*\
  !*** external "firebase/auth" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/auth");;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();